import indexRouter from '../routes';
import usersRouter from '../routes/users';

const routes = (app: any) => {
  app.use('/users', usersRouter);
  app.use('/', indexRouter);
};

export default routes;
