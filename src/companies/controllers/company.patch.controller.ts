// src/companies/controllers/company.patch.controller.ts
import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { patchCompanyService } from '../services/company.patch.service.js';
import { patchCompanySchema } from '../schemas/company.patch.schema.js';

export const patchCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.isAdmin)
      throw createHttpError(401, '관리자 권한이 필요합니다.');

    const { companyId } = req.params;
    const { companyName, companyCode } = req.body;

    const updatedCompany = await patchCompanyService(Number(companyId), {
      companyName,
      companyCode,
    });

    res.status(200).json(updatedCompany);
  } catch (err) {
    next(err);
  }
};
