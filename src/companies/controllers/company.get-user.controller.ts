import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { getCompanyUsersService } from '../services/company.get-user.service.js';
import { getCompanyUsersQuerySchema } from '../schemas/company.get-user.schema.js';

export const getCompanyUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // ✅ Zod 검증 (임시 컨트롤러 내부에서만 사용)
    const parsed = getCompanyUsersQuerySchema.parse(req.query);
    const { page, pageSize, searchBy, keyword } = parsed;

    // 🚀 서비스 호출
    const result = await getCompanyUsersService(
      page,
      pageSize,
      searchBy,
      keyword,
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
