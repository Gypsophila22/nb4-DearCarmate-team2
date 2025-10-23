// src/companies/controllers/company.patch.controller.ts
import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import companyService from '../services/index.js';

export const patchCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.isAdmin) {
      throw createHttpError(401, '관리자 권한이 필요합니다.');
    }

    const companyId = Number(req.params.companyId);
    const { companyName, companyCode } = req.body;

    const updatedCompany = await companyService.patchCompanyService(companyId, {
      companyName,
      companyCode,
    });

    res.status(200).json(updatedCompany);
  } catch (err) {
    next(err);
  }
};
