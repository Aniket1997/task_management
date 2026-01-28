import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().allow('', null),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zipCode: Joi.string(),
    country: Joi.string(),
  }),
}).min(1);
