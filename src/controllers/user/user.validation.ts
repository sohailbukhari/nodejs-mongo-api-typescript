import Joi from 'joi';

export const register = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.string().optional(),
});

export const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const update = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  role: Joi.string().optional(),
  phone: Joi.string().optional().allow(null),
}).options({ stripUnknown: true });

export const forgot = Joi.object({
  email: Joi.string().required(),
});

export const reset = Joi.object({
  password: Joi.string().required(),
}).options({ stripUnknown: true });
