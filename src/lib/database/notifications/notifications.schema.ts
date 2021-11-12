import { Schema } from 'mongoose';

export interface Notification {
  userRef: String;
  streamName: String;
  dataPath: String;
  value: Number;
  operator: String;
  subscription?: String;
};
export const NotificationSchema = new Schema<Notification>({
  userRef: { type: String, required: true },
  streamName: { type: String, required: true },
  dataPath: { type: String, required: true },
  value: { type: String, required: true },
  operator: { type: String, required: true }
});