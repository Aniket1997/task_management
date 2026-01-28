import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendResponse } from '../utils/response';

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getProfile(req.user!.id);
    sendResponse(res, 200, 'Profile fetched', user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateProfile(req.user!.id, req.body);
    sendResponse(res, 200, 'Profile updated', user);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, 200, 'User fetched', user);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userService.getAllUsers(req.query as { page?: number; limit?: number; role?: string });
    sendResponse(res, 200, 'Users fetched', result);
  } catch (err) {
    next(err);
  }
};
