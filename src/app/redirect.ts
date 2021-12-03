import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const BINANCE_API = 'https://api.binance.com';
export const Redirects = Router();

Redirects.use(createProxyMiddleware('/api/binance', {
  target: BINANCE_API,
  changeOrigin: true,
  pathRewrite: {
    '^/api/binance': '/api'
  }
}));

export default Redirects;
