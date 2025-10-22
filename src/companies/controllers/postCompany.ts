import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';
import createHttpError from 'http-errors';

async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.isAdmin) {
      return next(createHttpError(401, '관리자 권한이 필요합니다.'));
    }

    const rawName = (req.body.companyName ?? req.body.name) as
      | string
      | undefined;
    const rawCode = (req.body.companyCode ?? req.body.code) as
      | string
      | undefined;

    const companyName = rawName?.trim();
    const companyCode = rawCode?.trim().toUpperCase();

    if (!companyName || !companyCode) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const exists = await prisma.companies.findUnique({
      where: { companyCode },
    });
    if (exists) {
      return res.status(400).json({ message: '이미 존재하는 회사 코드입니다' });
    }

    const company = await prisma.companies.create({
      data: { companyName, companyCode },
    });

    return res.status(201).json({
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount: 0,
    });
  } catch (err) {
    if (createHttpError.isHttpError(err)) {
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
    next(err);
  }
}

export default { createCompany };
