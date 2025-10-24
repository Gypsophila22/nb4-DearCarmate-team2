import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import companyService from '../services/index.js';

// 1️⃣ 쿼리 파라미터 타입 정의
type SearchBy = 'companyName' | 'companyCode';

export interface GetCompanyQuery {
  page?: string;
  pageSize?: string;
  searchBy?: SearchBy;
  keyword?: string;
}

// 2️⃣ Express Request에 제네릭으로 명시
export const getCompany = async (
  req: Request<unknown, unknown, unknown, GetCompanyQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.isAdmin) {
      throw createHttpError(401, '관리자 권한이 필요합니다.');
    }

    const { page, pageSize, searchBy, keyword } = req.query;

    // 3️⃣ searchBy 값 검증 (TS 레벨에서도 자동 제약)
    const validSearchFields: SearchBy[] = ['companyName', 'companyCode'];
    if (searchBy && !validSearchFields.includes(searchBy)) {
      throw createHttpError(400, '유효하지 않은 검색 기준입니다.');
    }

    const result = await companyService.getCompanyService(
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
