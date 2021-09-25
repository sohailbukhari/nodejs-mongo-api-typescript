import indexRouter from '../routes';
import usersRouter from '../routes/users';

const routes = (app: any) => {
  app.use('/', usersRouter);
  app.use('/info', indexRouter);
};

export default routes;
