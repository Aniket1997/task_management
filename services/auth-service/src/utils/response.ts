import { Response } from 'express';

export const sendResponse = (res: Response, statusCode: number, message: string, data?: unknown): Response => {
  const response: { success: boolean; message: string; data?: unknown } = {
    success: statusCode < 400,
    message,
  };
  if (data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
};
