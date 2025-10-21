import contractService from '../services/index.js';

import type { Request, Response, NextFunction } from 'express';

// 계약용 고객 목록 조회 컨트롤러
export const getCustomersListForContractController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await contractService.getCustomersListForContract();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
