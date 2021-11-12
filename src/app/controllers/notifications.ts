import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { toUpper } from 'lodash';
import { PushManager } from '../../lib/push-notifications';
import { NotificationService, Notification, UserService } from '../../lib/database'
import { BinanceAnalysis, StreamType, IntervalType } from '@tommy_234/live-data';

class NotificationController {
  notificationService: NotificationService;
  userService: UserService;
  router: Router;

  constructor() {
    this.userService = new UserService();
    this.notificationService = new NotificationService();
    this.routes();
  }

  private routes() {
    const router = Router();
    router.get(
      '/:id',
      async (req, res) => {
        const notification = await this.notificationService.findOne(req.params.id);
        if (notification) {
          return res.status(200).json(notification);
        }
        return res.status(404).json({ message: "Invalid Notification" });
      }
    );
    router.post(
      '/',
      body('userRef').isString(),
      body('streamName').isString(),
      body('dataPath').isString(),
      body('operator').isString(),
      body('value').isNumeric(),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        const { userRef, streamName, dataPath, operator, value, subscription } = req.body;
        
        const user = await this.userService.findOne(userRef);
        if (!user) {
          return res.status(400).json({ message: "Invalid User" });
        }

        const { binanceAnalysis, pushManager }: {
          binanceAnalysis: BinanceAnalysis,
          pushManager: PushManager
        } = req.custom;
      
        let stream = binanceAnalysis.streamManager.findStream(streamName);
      
        if (!stream) {
          const [symbol, streamTypeInterval] = streamName.split('@');
          const [streamType, interval] = streamTypeInterval.split('_');
          stream = await binanceAnalysis.newStream(
            toUpper(symbol),
            streamType as StreamType,
            interval as IntervalType
          );
          binanceAnalysis.resetStream();
        }
      
        const [dataType, dataName] = dataPath.split('.');
        if (dataType === 'indicator') {
          const [indicatorType, indicatorCount] = dataName.split('.');
          if (!stream.findIndicator(indicatorType, indicatorCount)) {
            stream.newIndicator(indicatorType, indicatorCount);
          }
        }
      
        binanceAnalysis.streamManager.newNotification({
          streamName, dataPath, operator, value,
          callback: () => {
            console.log(' *** Market condition is true *** ');
            const stream = binanceAnalysis.streamManager.findStream(streamName);
            stream.notifications.length === 0 &&
              binanceAnalysis.streamManager.deleteStream(streamName);
              binanceAnalysis.resetStream();
          }
        });

        // binanceAnalysis.streamManager.newNotification({
        //   streamName, dataPath, operator, value,
        //   callback: () => pushManager.sendMessage(
        //     subscription,
        //     {
        //       title: 'Binance notification',
        //       body: `${streamName} - ${dataPath} ${operator} ${value}`
        //     }
        //   )
        // });            
              
        const newNotification = await this.notificationService.create(req.body as Notification);
        return res.status(201).json(newNotification);
      }
    );
    this.router = router;
  }
}

export default new NotificationController().router;
