// src/companies/controllers/company.get-user.controller.ts
import type { Request, Response, NextFunction } from 'express';
import companyService from '../services/index.js';
import createHttpError from 'http-errors';

// 1️⃣ 쿼리 타입을 명확히 정의
type SearchBy = 'companyName' | 'name' | 'email';

interface GetCompanyUsersQuery {
  page?: string;
  pageSize?: string;
  searchBy?: SearchBy;
  keyword?: string;
}

// 2️⃣ 제네릭으로 Express의 기본 ParsedQs 타입을 완전히 덮어씀
export const getCompanyUsers = async (
  req: Request<unknown, unknown, unknown, GetCompanyUsersQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.isAdmin) {
      throw createHttpError(401, '관리자 권한이 필요합니다.');
    }
    // 3️⃣ 이제 타입이 정확히 string으로 추론됨
    const { page, pageSize, searchBy, keyword } = req.query;

    const result = await companyService.getCompanyUsersService(
      Number(page ?? 1),
      Number(pageSize ?? 8),
      searchBy ?? '',
      keyword ?? '',
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
