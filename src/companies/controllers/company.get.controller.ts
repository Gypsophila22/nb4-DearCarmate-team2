import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { getCompanyService } from '../services/company.get.service.js';
import { getCompanyQuerySchema } from '../schemas/company.get.schema.js';

export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // ✅ zod로 검증 + 변환
    const parsed = getCompanyQuerySchema.parse({ query: req.query });
    const { page, pageSize, searchBy, keyword } = parsed.query;

    // 🔐 관리자 권한 확인
    if (!req.user?.isAdmin) {
      throw createHttpError(401, '관리자 권한이 필요합니다');
    }

    // 🚀 서비스 호출
    const result = await getCompanyService(page, pageSize, searchBy, keyword);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
