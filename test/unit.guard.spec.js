const passport = require('passport');
const guard = require('../helpers/guard');
const { HttpCode } = require('../helpers/constants');

describe('Unit test for middleware by authorization', () => {
  const user = { token: '010101010' };
  const req = { get: jest.fn(header => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(data => data),
  };
  const next = jest.fn();

  it('the user did not pass a token', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, false);
      },
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    });
  });

  it('user token is invalid', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, { token: '1232353' });
      },
    );
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    });
  });

  it('user token is valid', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, user);
      },
    );
    guard(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
