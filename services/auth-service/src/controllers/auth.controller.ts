import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendResponse } from '../utils/response';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    sendResponse(res, 201, 'User registered successfully', result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    sendResponse(res, 200, 'Login successful', result);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await authService.logout(token!, req.user!.id);
    sendResponse(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.refreshToken(req.body.refreshToken);
    sendResponse(res, 200, 'Token refreshed', result);
  } catch (err) {
    next(err);
  }
};
