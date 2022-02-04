import Joi from 'joi';
import { genericQueries } from '../../utils/common';

import { Gender, Role } from '../../types/UserIF';

const GENDERS = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
const ROLES = [Role.ADMIN, Role.USER];

export const register = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  zip: Joi.number().required(),
  gender: Joi.string()
    .valid(...GENDERS)
    .required(),
}).options({ stripUnknown: true });

export const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({ stripUnknown: true });

export const update = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  zip: Joi.number().optional(),
  gender: Joi.string()
    .valid(...GENDERS)
    .optional(),
  role: Joi.string()
    .valid(...ROLES)
    .optional(),
}).options({ stripUnknown: true });

export const forgot = Joi.object({
  email: Joi.string().required(),
}).options({ stripUnknown: true });

export const reset = Joi.object({
  password: Joi.string().required(),
}).options({ stripUnknown: true });

export const resetQuery = Joi.object({
  code: Joi.string().required(),
  email: Joi.string().required(),
}).options({ stripUnknown: true });

export const query = Joi.object({
  ...genericQueries,
  search: Joi.string().optional(),
  role: Joi.string()
    .valid(...ROLES)
    .optional(),
}).options({ stripUnknown: false });
