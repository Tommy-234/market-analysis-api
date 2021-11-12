import { Schema } from 'mongoose';
import { Notification, NotificationSchema} from '../notifications';

export interface User {
  userName: String;
  password: String;
  email: String;
  apiKeys?: {
    binanceApiKey: String;
    binanceSecretKey: String;
  };
  notifications?: Array<Notification>;
  watchList?: Array<{
    streams: Array<String>;
    dataPaths: Array<String>;
    name: String;
  }>;
};
export const UserSchema = new Schema<User>({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  apiKeys: {
    binanceApiKey: String,
    binanceSecretKey: String,
  },
  notifications: [NotificationSchema],
  watchList: [{
    streams: [String],
    dataPaths: [String],
    name: String
  }]
});
