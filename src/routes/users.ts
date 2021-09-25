import { Router } from 'express';
import { createValidator } from 'express-joi-validation';

import * as userController from '../controllers/user/user.controller';
import * as userValidation from '../controllers/user/user.validation';
import * as Auth from '../middlewares/auth';

const validator = createValidator({ passError: true });

const router = Router();

router.get('/me', Auth.strict, async function (req: any, res: any, next) {
  try {
    let user = await userController.getRedisUser(req.token.sub);

    if (user) return res.reply({ data: JSON.parse(user) });

    user = await userController.get({ sub: req.token.sub });

    return res.reply({ data: user });
  } catch (err) {
    return next(err);
  }
});

// Update Self / User ( Admin Access )
router.put('/', Auth.strict, validator.body(userValidation.update), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.update({ sub: req.token.sub, args: req.body, isAdmin: req.isAdmin }) });
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

router.get('/access_token', Auth.locked, async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.accessToken(req.token) });
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

router.post('/reset/:reset_token', validator.body(userValidation.reset), async function (req: any, res: any, next) {
  try {
    return res.reply({ data: await userController.reset(req.params.reset_token, req.body.password) });
  } catch (err) {
    return next(err);
  }
});

export default router;
