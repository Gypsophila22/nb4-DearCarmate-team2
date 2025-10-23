// src/companies/controllers/company.get.controller.ts
import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import companyService from '../services/index.js';

export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.isAdmin) {
      throw createHttpError(401, '관리자 권한이 필요합니다.');
    }

    const { page, pageSize, searchBy, keyword } = req.query as any;

    const validSearchFields = ['companyName', 'companyCode'];
    if (searchBy && !validSearchFields.includes(searchBy)) {
      throw createHttpError(400, '유효하지 않은 검색 기준입니다.');
    }

    const result = await companyService.getCompanyService(
      Number(page),
      Number(pageSize),
      searchBy,
      keyword,
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
