import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.js';

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
      companyName: c.name,
      companyCode: c.code,
      userCount: c._count.user,
      // createdAt: c.createdAt,
    }));

    const pageInfo = {
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };

    return res.json({ success: true, data: { items, pageInfo } });
  } catch (err) {
    next(err);
  }
}

export default { getCompany };
