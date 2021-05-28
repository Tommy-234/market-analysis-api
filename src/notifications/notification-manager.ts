import {
  setVapidDetails,
  sendNotification,
  PushSubscription as WebPushSubscription
} from 'web-push';

export class NotificationManager {
  constructor(
    mailTo: string,
    vapidPublic: string,
    vapidPrivate: string
  ) {
    setVapidDetails(mailTo, vapidPublic, vapidPrivate);
  }

  sendMessage = (subscription: WebPushSubscription, payload: Record<string, unknown>) => {
    sendNotification(subscription, JSON.stringify(payload))
    .then(result => console.log(result))
    .catch(e => console.log(e.stack))
  }
}

export interface PushSubscription extends WebPushSubscription {};
