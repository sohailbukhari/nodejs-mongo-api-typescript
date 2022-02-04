import { RequestHandler } from 'express';

import { Role } from '../types/UserIF';
import { unlock } from '../utils/locker';

import { ClientIF } from 'src/types/AuthIF';

export const strict: RequestHandler = async (request: any, response: any, next) => {
  let client: ClientIF, decoded: any;
  try {
    decoded = await unlock(request);
    client = decoded;
    request.client = client;
    next();
  } catch (err) {
    next(err);
  }
};

export const verify: RequestHandler = async (request: any, response: any, next) => {
  let client: ClientIF, decoded: any;

  try {
    decoded = await unlock(request);
    client = decoded;

    if (!client.type) {
      request.client = client;
      next();
    } else throw { status: 401 };
  } catch (err) {
    next(err);
  }
};

export const isAdmin: RequestHandler = async (request: any, response: any, next) => {
  let client: ClientIF, decoded: any;
  try {
    decoded = await unlock(request);
    client = decoded;

    if (client.role === Role.ADMIN) {
      request.client = client;
      next();
    } else throw { status: 401 };
  } catch (err) {
    next(err);
  }
};
