const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../model/users');
const UploadAvatar = require('../services/upload-avatars-local');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { HttpCode } = require('../helpers/constants');
const EmailService = require('../services/email');
const CreateSenderSendgrid = require('../services/sender-email');

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }

    const newUser = await Users.create(req.body);
    const { email, subscription, avatarURL, verifyToken } = newUser;

    //send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid(),
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email,
          subscription,
          avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.validPassword(req.body.password);

    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
    const { email, subscription } = user;

    await Users.updateToken(user.id, token);

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await Users.updateToken(req.user.id, null);

    return res
      .status(HttpCode.UNAUTHORIZED)
      .json({ message: 'Not authorized' });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { user: { email, subscription } },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await Users.updateSubscription(
      req.user.id,
      req.body.subscription,
    );
    const { email, subscription } = user;

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { user: { email, subscription } },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const { id } = req.user;
    const uploads = new UploadAvatar();

    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });

    await Users.updateAvatar(id, avatarUrl);

    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.verificationToken);

    if (user) {
      await Users.updateVerifyToken(user.id, true, null);

      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found with verification token',
    });
  } catch (error) {
    next(error);
  }
};

const repeatSendEmailVerify = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      const { email, verifyToken, verify } = user;

      if (!verify) {
        //send email
        try {
          const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSenderSendgrid(),
          );
          await emailService.sendVerifyPasswordEmail(verifyToken, email);

          return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            message: 'Verification email sent',
          });
        } catch (error) {
          console.log(error.message);
          return next(error);
        }
      }

      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Verification has already been passed',
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  update,
  avatars,
  verify,
  repeatSendEmailVerify,
};
