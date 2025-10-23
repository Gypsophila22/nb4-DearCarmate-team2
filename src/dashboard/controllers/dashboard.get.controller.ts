import type { Request, Response, NextFunction } from 'express';
import { dashboardGetService } from '../services/dashboard.get.service.js';

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await dashboardGetService.getDashboard();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
