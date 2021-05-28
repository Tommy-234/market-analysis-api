import { BinanceAnalysis } from '@tommy_234/live-data';
import { NotificationManager } from '../notifications';
import { Express } from 'express';
export declare class Server {
    app: Express;
    notificationManager: NotificationManager;
    binanceAnalysis: BinanceAnalysis;
    constructor();
    setupEndpoints: () => void;
}
