import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { patchContractDocuments as svc } from '../services/contractDocuments.service.js';

export async function patchContractDocuments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return next(createError(401, '로그인이 필요합니다'));

    const raw = req.params.contractId ?? req.params.id;
    const contractId = Number(raw);
    if (!Number.isInteger(contractId) || contractId <= 0) {
      return next(createError(400, '잘못된 요청입니다'));
    }

    // 컨벤션대로: req.body 원본을 그대로 넘김 (스키마 결과 사용 X)
    const result = await svc({
      contractId,
      actor: {
        id: req.user.id,
        companyId: req.user.companyId,
        isAdmin: req.user.isAdmin,
      },
      body: req.body,
    });

    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
