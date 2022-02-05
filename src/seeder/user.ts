import faker from '@faker-js/faker';
import * as UserController from '../controllers/user/user.controller';

import logger from '../utils/logger';
import { pickRandom } from '../utils/common';

export const init = async (length: number) => {
  for (let x = 0; x < length; x++) {
    try {
      await UserController.bulkCreate({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: 'abc@1234',
        phone: faker.phone.phoneNumberFormat(),
        address: faker.address.streetAddress(),
        zip: 1232,
        role: 'user',
        gender: pickRandom(['male', 'female'], { count: 1 })[0],
      });
    } catch (err) {
      logger.error('User Seeding');
    }
  }
};
