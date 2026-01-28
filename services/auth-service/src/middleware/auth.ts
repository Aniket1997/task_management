import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import redis from '../config/redis';
import { AppError } from '../../../../shared/middleware/errorHandler';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token = authHeader.split(' ')[1];

    const isBlacklisted = await redis.get(`bl:${token}`);
    if (isBlacklisted) throw new AppError('Token has been revoked', 401);

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(err);
  }
};

export const authorize = (...roles: string[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Insufficient permissions', 403));
  }
  next();
};
