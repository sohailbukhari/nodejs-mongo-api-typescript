import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import * as userController from '../controllers/user/user.controller';
import * as userValidation from '../controllers/user/user.validation';
import * as Auth from '../middlewares/auth';

const validator = createValidator({ passError: true });

const router = Router();

router.get('/report', async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.report() });
  } catch (err) {
    return next(err);
  }
});

router.get('/me', Auth.strict, async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.get(req.client.sub) });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', Auth.isAdmin, async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.get(req.params.id) });
  } catch (err) {
    return next(err);
  }
});

router.get('/', Auth.isAdmin, validator.query(userValidation.query), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.list(req.query) });
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', Auth.strict, validator.body(userValidation.update), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.update(req.client, req.params.id, req.body) });
  } catch (err) {
    return next(err);
  }
});

router.post('/register', validator.body(userValidation.register), async function (req, res: any, next) {
  try {
    return res.reply({ data: await userController.register(req.body) });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', validator.body(userValidation.login), async function (req, res: any, next) {
  try {
    return res.reply({ data: await userController.login(req.body) });
  } catch (err) {
    return next(err);
  }
});

router.post('/forgot_password', validator.body(userValidation.forgot), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.forgot(req.body.email) });
  } catch (err) {
    return next(err);
  }
});

router.post('/reset', validator.query(userValidation.resetQuery), validator.body(userValidation.reset), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.reset(req.query, req.body.password) });
  } catch (err) {
    return next(err);
  }
});

router.post('/verify', validator.query(userValidation.resetQuery), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.verification(req.query) });
  } catch (err) {
    return next(err);
  }
});

export default router;
