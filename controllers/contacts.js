const { isValidObjectId } = require('mongoose');
const { HttpCode } = require('../helpers/constants');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../model/contacts');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, offset, page } = await listContacts(
      userId,
      req.query,
    );

    return res.status(200).json({
      status: 'success',
      code: HttpCode.OK,
      data: { contacts, total, limit, offset, page },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Invalid id',
      });
    }

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }

    return res.json({ status: 'success', code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await addContact({ ...req.body, owner: userId });

    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Invalid id',
      });
    }

    const result = await removeContact(contactId, userId);

    if (!result) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }

    return res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Invalid id',
      });
    }

    const contact = await updateContact(contactId, userId, req.body);

    if (!contact) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      });
    }

    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Invalid id',
      });
    }

    const contact = await updateStatusContact(contactId, userId, req.body);

    if (!contact) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      });
    }

    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { contact } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, remove, update, updateStatus };
