import { Router } from 'express';
import UserRoutes from './users';
import NotificationRoutes from './notifications';

export const AppController = Router();

AppController.use('/user', UserRoutes);
AppController.use('/notification', NotificationRoutes);

export default AppController;
