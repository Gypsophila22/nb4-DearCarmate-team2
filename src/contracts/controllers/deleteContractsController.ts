import contractService from '../services/index.js';

import type { NextFunction, Request, Response } from 'express';

export const deleteContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { contractId } = req.schema as { contractId: number };
    // 서비스 호출
    await contractService.delete(contractId);
    return res.status(200).json({ message: '계약 삭제 성공' });
  } catch (err) {
    next(err);
  }
};
