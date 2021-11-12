import { Router } from 'express';
import UserRoutes from './users';
import NotificationRoutes from './notifications';
import { Redirects } from './redirect';

export const AppController = Router();

AppController.use(Redirects);
AppController.use('/user', UserRoutes);
AppController.use('/notification', NotificationRoutes);

export default AppController;
