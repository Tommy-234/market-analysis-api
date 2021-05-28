"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const live_data_1 = require("@tommy_234/live-data");
const notifications_1 = require("../notifications");
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const bodyParser = __importStar(require("body-parser"));
const lodash_1 = require("lodash");
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
class Server {
    constructor() {
        this.setupEndpoints = () => {
            this.app.use('/api/binance', http_proxy_middleware_1.createProxyMiddleware({
                target: BINANCE_API,
                changeOrigin: true,
                pathRewrite: {
                    '^/api/binance': '/api'
                }
            }));
            this.app.post('/api/notification', (req, res) => __awaiter(this, void 0, void 0, function* () {
                console.log(req.body);
                const { streamName, dataPath, operator, value, subscription } = req.body;
                let stream = this.binanceAnalysis.streamManager.findStream(streamName);
                if (!stream) {
                    const [symbol, streamTypeInterval] = streamName.split('@');
                    const [streamType, interval] = streamTypeInterval.split('_');
                    console.log("Adding new stream");
                    stream = yield this.binanceAnalysis.newStream(lodash_1.toUpper(symbol), streamType, interval);
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
                    callback: () => this.notificationManager.sendMessage(subscription, {
                        title: 'Binance notification',
                        body: `${streamName} - ${dataPath} ${operator} ${value}`
                    })
                });
                res.send('success!');
            }));
            this.app.get('/', (req, res) => {
                res.send('Hello, world!');
            });
        };
        this.app = express_1.default();
        this.app.use(bodyParser.json());
        this.setupEndpoints();
        this.app.listen(PORT, () => {
            return console.log(`server is listening on port: ${PORT}`);
        });
        this.notificationManager = new notifications_1.NotificationManager('mailto:test@example.com', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
        this.binanceAnalysis = new live_data_1.BinanceAnalysis({ onUpdate: () => { }, config });
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map