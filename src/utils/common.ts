import Joi from 'joi';
import sha256 from 'sha256';

import keys from '../config/keys';

export const hash = (str: string) => {
  return sha256(str + keys.secret);
};

export const time = () => Math.floor(Date.now() / 1000);

export const pickRandom = (data: any, { count = 1 } = {}) => {
  if (!Array.isArray(data)) {
    throw new TypeError('Expected an array as the first argument');
  }

  if (count > data.length) {
    throw new Error('Count must be lower or the same as the number of picks');
  }

  data = [...data];

  const pickedElements = [];

  while (count--) {
    pickedElements.push(data.splice(Math.floor(Math.random() * data.length), 1)[0]);
  }

  return pickedElements;
};

export const genericQueries = {
  limit: Joi.number().integer().default(25).max(50).optional(),
  offset: Joi.number().integer().default(0).optional(),
  page: Joi.number().integer().default(1).min(1).optional(),
};

export const filterQuery = (query: any, filters: string[]) => {
  const args: any = {};

  filters.forEach((filter) => {
    if (query[filter] && !args[filter]) {
      args[filter] = query[filter];
      delete query[filter];
    }
  });

  // optimised search ( indexed )
  if (query.search) {
    args.$text = { $search: query.search };
    delete query.search;
  }

  return { args, query };
};
