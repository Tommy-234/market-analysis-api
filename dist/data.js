// import {
//   BinanceAnalysis,
//   StreamType,
//   IntervalType,
//   IndicatorType
// } from '@tommy_234/live-data';
// const config = {
//   apiConfig: {
//     endpoint: 'https://api.binance.com/api',
//     apiKey: '',
//     secretKey: ''
//   },
//   streamConfig: {
//     endpoint: 'wss://stream.binance.com:9443/stream'
//   }
// }
// const initBinanceAnalysis = async () => {
//   const binanceAnalysis = new BinanceAnalysis({ onUpdate: this.updateClients, config });
//   binanceAnalysis.streamManager.newIndicator(IndicatorType.RSI, 14);
//   binanceAnalysis.streamManager.newIndicator(IndicatorType.MovingAverage, 50);
//   binanceAnalysis.streamManager.newIndicator(IndicatorType.MovingAverage, 100);
//   await binanceAnalysis.newStream('BTCUSDT', StreamType.KLINE, IntervalType.Minute5);
//   await binanceAnalysis.newStream('BTCUSDT', StreamType.KLINE, IntervalType.Hour1);
//   binanceAnalysis.resetStream();
//   this.binanceAnalysis = binanceAnalysis;
// }
//# sourceMappingURL=data.js.map