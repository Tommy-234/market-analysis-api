declare namespace Express {
  export interface Request {
    custom?: {
      binanceAnalysis: any,
      pushManager: any
    };
  }
}