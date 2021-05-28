"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationManager = void 0;
const web_push_1 = require("web-push");
class NotificationManager {
    constructor(mailTo, vapidPublic, vapidPrivate) {
        this.sendMessage = (subscription, payload) => {
            web_push_1.sendNotification(subscription, JSON.stringify(payload))
                .then(result => console.log(result))
                .catch(e => console.log(e.stack));
        };
        web_push_1.setVapidDetails(mailTo, vapidPublic, vapidPrivate);
    }
}
exports.NotificationManager = NotificationManager;
;
//# sourceMappingURL=notification-manager.js.map