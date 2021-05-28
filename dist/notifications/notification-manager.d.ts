import { PushSubscription as WebPushSubscription } from 'web-push';
export declare class NotificationManager {
    constructor(mailTo: string, vapidPublic: string, vapidPrivate: string);
    sendMessage: (subscription: WebPushSubscription, payload: Record<string, unknown>) => void;
}
export interface PushSubscription extends WebPushSubscription {
}
