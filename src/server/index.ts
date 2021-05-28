import {
  BinanceAnalysis,
  StreamType,
  IntervalType,
  IndicatorType
} from '@tommy_234/live-data';

import { NotificationManager } from '../notifications';
import express, { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as bodyParser from 'body-parser';
import { toUpper } from 'lodash';

const PORT = 3001;
const BINANCE_API = 'https://api.binance.com';
const config = {
  apiConfig: {
    endpoint: 'https://api.binance.com/api',
    apiKey: '',
    secretKey: ''
  },
  streamConfig: {
    endpoint: 'wss://stream.binance.com:9443/stream'
  }
};

export class Server {
  app: Express;
  notificationManager: NotificationManager;
  binanceAnalysis: BinanceAnalysis;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.setupEndpoints();
    this.app.listen(PORT, () => {
      return console.log(`server is listening on port: ${PORT}`);
    });

    this.notificationManager = new NotificationManager(
      'mailto:test@example.com',
      process.env.VAPID_PUBLIC,
      process.env.VAPID_PRIVATE
    );

    this.binanceAnalysis = new BinanceAnalysis({ onUpdate: () => {}, config });
  }

  setupEndpoints = () => {
    this.app.use('/api/binance', createProxyMiddleware({
      target: BINANCE_API,
      changeOrigin: true,
      pathRewrite: {
        '^/api/binance': '/api'
      }
    }));

    this.app.post('/api/notification', async (req, res) => {

      console.log(req.body);

      const {streamName, dataPath, operator, value, subscription} = req.body;

      let stream = this.binanceAnalysis.streamManager.findStream(streamName);

      if (!stream) {
        const [symbol, streamTypeInterval] = streamName.split('@');
        const [streamType, interval] = streamTypeInterval.split('_');
        console.log("Adding new stream")
        stream = await this.binanceAnalysis.newStream(
          toUpper(symbol),
          streamType as StreamType,
          interval as IntervalType
        );
        this.binanceAnalysis.resetStream();
      }

      const [dataType, dataName] = dataPath.split('.');
      if (dataType === 'indicator') {
        const [indicatorType, indicatorCount] = dataName.split('.');
        if (!stream.findIndicator(indicatorType, indicatorCount)) {
          stream.newIndicator(indicatorType, indicatorCount);
        }
      }

      // this.binanceAnalysis.streamManager.newNotification({
      //   streamName, dataPath, operator, value,
      //   callback: () => console.log(' *** Market condition is true *** ')
      // });

      this.binanceAnalysis.streamManager.newNotification({
        streamName, dataPath, operator, value,
        callback: () => this.notificationManager.sendMessage(
          subscription,
          {
            title: 'Binance notification',
            body: `${streamName} - ${dataPath} ${operator} ${value}`
          }
        )
      });

      res.send('success!');

    })

    this.app.get('/', (req, res) => {
      res.send('Hello, world!');
    });
  }
}
