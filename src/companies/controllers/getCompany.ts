import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    res.setHeader("Cache-Control", "no-store");

    const DEFAULT_PAGE_NUM = 1;
    const DEFAULT_PAGE_SIZE = 10;

    const page = Number(req.query.page) || DEFAULT_PAGE_NUM;
    const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;

    const totalItemCount = await prisma.companies.count();

    const companies = await prisma.companies.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { user: true } },
      },
    });

    // ✅ _count.user -> userCount 로 변환
    const items = companies.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      companyCode: c.companyCode,
      userCount: c._count.user ?? 0,
    }));

    // ✅ 프론트 명세서 형식에 맞게 메타데이터 필드 구성
    const totalPages = Math.ceil(totalItemCount / pageSize);
    const currentPage = page;

    // ✅ 응답 형식 수정
    return res.status(200).json({
      currentPage,
      totalPages,
      totalItemCount,
      data: items,
    });
  } catch (err) {
    next(err);
  }
}

export default { getCompany };
