import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { patchCompanyService } from '../services/company.patch.service.js';

export const patchCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = parseInt(req.params.companyId!);
    const { companyName, companyCode } = req.body;

    if (isNaN(companyId)) {
      throw createHttpError(400, '잘못된 요청입니다');
    }

    // 🔐 관리자 권한 확인 (추후 passport 연결 시 복원)
    if (!req.user?.isAdmin)
      throw createHttpError(401, '관리자 권한이 필요합니다.');

    const updatedCompany = await patchCompanyService(
      companyId,
      companyName,
      companyCode,
    );
    res.status(200).json(updatedCompany);
  } catch (err) {
    next(err);
  }
};
