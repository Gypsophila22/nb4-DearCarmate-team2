import createError from 'http-errors';

import { ContractIdParamSchema } from '../contract.schema.js';
import contractsService from '../services/index.js';

import type { Request, Response, NextFunction } from 'express';

/**
 * 계약 업데이트
 */
export const updateContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw createError(401, '로그인이 필요합니다.');

    const paramResult = ContractIdParamSchema.safeParse(req.params);
    if (!paramResult.success)
      throw createError(404, '존재하지 않는 계약입니다');

    const contractId = Number(paramResult.data.contractId);

    // 계약 업데이트 서비스 호출
    const result = await contractsService.update(req.user.id, {
      ...req.body,
      contractId,
    });

    // 결과 반환
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
