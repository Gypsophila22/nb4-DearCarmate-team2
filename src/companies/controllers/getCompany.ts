import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';


async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    // const page = parseInt((req.query.page as string) ?? '1', 10) || 1;
    // const pageSize = parseInt((req.query.pageSize as string) ?? '10', 10) || 10;

    res.setHeader("Cache-Control", "no-store");

    const DEFAULT_PAGE_NUM = 1;
    const DEFAULT_PAGE_SIZE = 10;


    const page = Number(req.query.page) || DEFAULT_PAGE_NUM; //MIN_PAGE_NUM
    const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;


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
      userCount: c._count.user ?? 0,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));


    const pageInfo = {
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };


    return res.json({ success: true, data: companies });
  } catch (err) {
    next(err);
  }
}


export default { getCompany };



