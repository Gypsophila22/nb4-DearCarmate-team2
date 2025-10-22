import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { deleteCompanyService } from '../services/company.delete.service.js';

export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyIdParam = req.params.companyId;
    if (!companyIdParam) throw createHttpError(400, '잘못된 요청입니다');

    const companyId = parseInt(companyIdParam);
    if (isNaN(companyId)) throw createHttpError(400, '잘못된 요청입니다');

    if (!req.user?.isAdmin)
      throw createHttpError(401, '관리자 권한이 필요합니다.');

    const result = await deleteCompanyService(companyId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
