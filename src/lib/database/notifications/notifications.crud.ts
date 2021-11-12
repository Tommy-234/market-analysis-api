import { Notification, NotificationSchema } from './notifications.schema';
import { Model, model } from 'mongoose';

export class NotificationService {
  private notification: Model<Notification>;

  constructor() {
    this.notification = model<Notification>('Notification', NotificationSchema);
  }

  async create(newNotification: Notification): Promise<Notification> {
    return await new this.notification(newNotification).save();
  }

  async find(where: Record<string, unknown>): Promise<Notification[]> {
    return await this.notification.find(where);
  }

  async findOne(id: string): Promise<Notification> {
    return await this.notification.findById(id);
  }

}