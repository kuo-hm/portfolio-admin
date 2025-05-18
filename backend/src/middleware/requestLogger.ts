import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Get the start time when request begins
  const start = Date.now();
  
  // Log when the request finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'unknown';
    const origin = req.get('origin') || 'unknown';
    
    logger.info('Request completed', {
      method,
      url: originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent,
      origin
    });
  });

  next();
}; 