import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) ?? '1', 10) || 1;
    const pageSize = parseInt((req.query.pageSize as string) ?? '10', 10) || 10;
    const skip = (page - 1) * pageSize;

    const totalItems = await prisma.companies.count();

    const companies = await prisma.companies.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { user: true } },
      },
    });

    const items = companies.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      companyCode: c.companyCode,
      userCount: c._count.user,
      // createdAt: c.createdAt,
    }));

    const pageInfo = {
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };

    const companyName = rawName?.trim();
    const companyCode = rawCode?.trim().toUpperCase();


    if (!companyName || !companyCode) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }


    // 중복 코드 확인
    const exists = await prisma.companies.findUnique({
      where: { companyCode },
    });
    if (exists) {
      return res.status(400).json({ message: "이미 존재하는 회사 코드입니다" });
    }


    // 회사 생성
    const company = await prisma.companies.create({
      data: { companyName, companyCode },
    });


    return res.status(201).json({
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount: 0,
    });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
}


export default { createCompany };





