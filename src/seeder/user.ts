import { faker } from '@faker-js/faker';
import * as UserController from '../controllers/user/user.controller';

import logger from '../utils/logger';

export const init = async (length: number) => {
  for (let x = 0; x < length; x++) {
    try {
      await UserController.bulkCreate({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'abc@1234',
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        zip: 1232,
        role: faker.helpers.arrayElement(['admin', 'user']),
        gender: faker.person.sexType(),
      });
    } catch (err) {
      logger.error('Error while seeding users');
    }
  }
};
