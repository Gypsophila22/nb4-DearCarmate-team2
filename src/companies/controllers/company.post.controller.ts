// src/companies/controllers/company.post.controller.ts
import type { Request, Response, NextFunction } from 'express';
import companyService from '../services/index.js';
import createHttpError from 'http-errors';

export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?.isAdmin) {
      throw createHttpError(401, '관리자 권한이 필요합니다.');
    }

    const { companyName, companyCode } = req.body;
    const company = await companyService.createCompanyService(
      companyName,
      companyCode,
    );

    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
}
