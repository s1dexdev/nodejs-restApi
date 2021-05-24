const Joi = require('joi');

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required(),
  password: Joi.string().min(3).max(15).required().label('Password'),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (error) {
    next({ status: 400, message: error.message.replace(/"/g, '') });
  }
};

module.exports.validateCreateUser = (req, _res, next) => {
  return validate(schemaCreateUser, req.body, next);
};

module.exports.validateUpdateSubscription = (req, _res, next) => {
  return validate(schemaUpdateSubscription, req.body, next);
};
