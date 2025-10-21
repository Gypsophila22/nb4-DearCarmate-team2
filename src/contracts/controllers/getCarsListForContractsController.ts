import contractService from '../services/index.js';

import type { Request, Response, NextFunction } from 'express';

/**
 * 계약용 차량 조회 컨트롤러
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getCarsListForContractController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await contractService.getCarsListForContract();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
