import express, { Express } from 'express';
import * as bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { BinanceAnalysis } from '@tommy_234/live-data';
import { PushManager } from '../lib/push-notifications';
import AppController from './controllers';
import { Redirects } from './redirect';

const PORT = 3001;
const MONGO_URL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:27017/MarketAnalysis?authSource=admin&readPreference=primary&ssl=false`;
const BINANCE_API = 'https://api.binance.com';
const config = {
  apiConfig: {
    endpoint: `${BINANCE_API}/api`,
    apiKey: '',
    secretKey: ''
  },
  streamConfig: {
    endpoint: 'wss://stream.binance.com:9443/stream'
  }
};

export class App {
  server: Express;
  pushManager: PushManager;
  binanceAnalysis: BinanceAnalysis;

  constructor() {
    this.setupServer();
    this.setupNotifications();
    this.setupAnalysis();
    this.setupMongoConnection()
  }

  setupServer = () => {
    const server = express();
    server.use(bodyParser.json());
    server.use(Redirects);
    server.use( (req, _, next) => {
      req.custom = {
        pushManager: this.pushManager,
        binanceAnalysis: this.binanceAnalysis
      }
      next();
    })
    server.use('/api', AppController);
    server.listen(PORT, () => {
      return console.log(`server is listening on port: ${PORT}`);
    });
    this.server = server;
  }

  setupNotifications = () => {
    this.pushManager = new PushManager(
      'mailto:test@example.com',
      process.env.VAPID_PUBLIC,
      process.env.VAPID_PRIVATE
    );
  }

  setupAnalysis = () => {
    this.binanceAnalysis = new BinanceAnalysis({
      onUpdate: ( data ) => console.log(data),
      config
    });
  }

  setupMongoConnection = async () => {
    await connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}