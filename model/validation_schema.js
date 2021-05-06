const Joi = require('joi');

const schemaPost = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required(),

  phone: Joi.string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .required(),
});

const schemaPatch = Joi.object({
  name: Joi.string().min(3).max(30),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase(),

  phone: Joi.string().regex(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  ),
});

module.exports = { schemaPost, schemaPatch };
