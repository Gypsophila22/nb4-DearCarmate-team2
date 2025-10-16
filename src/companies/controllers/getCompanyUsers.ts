import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

// 지원하는 검색 키
const SEARCHABLE_FIELDS = [
  'name',
  'email',
  'employeeNumber',
  'phoneNumber',
] as const;
type SearchBy = (typeof SEARCHABLE_FIELDS)[number];

async function getCompanyUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // path params
    const companyIdNum = Number(req.params.companyId);
    if (!Number.isInteger(companyIdNum) || companyIdNum <= 0) {
      return res.status(400).json({ message: '잘못된 회사 ID입니다.' });
    }

    // query params
    const page = Math.max(
      parseInt((req.query.page as string) ?? '1', 10) || 1,
      1
    );
    const pageSizeRaw =
      parseInt((req.query.pageSize as string) ?? '10', 10) || 10;
    const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100); // 1 ~ 100 제한
    const skip = (page - 1) * pageSize;

    const searchBy = (req.query.searchBy as string | undefined)?.trim() as
      | SearchBy
      | undefined;
    const keyword = (req.query.keyword as string | undefined)?.trim();

    if (searchBy && !SEARCHABLE_FIELDS.includes(searchBy)) {
      return res.status(400).json({
        message: `searchBy는 ${SEARCHABLE_FIELDS.join(
          ', '
        )} 중 하나여야 합니다.`,
      });
    }

    // where 조건 구성
    const where: any = { companyId: companyIdNum };
    if (searchBy && keyword) {
      where[searchBy] = { contains: keyword, mode: 'insensitive' as const };
    }

    // 회사 존재 여부(선택) - 404 주고 싶으면 활성화
    const companyExists = await prisma.companies.findUnique({
      where: { id: companyIdNum },
      select: { id: true },
    });
    if (!companyExists) {
      return res.status(404).json({ message: '회사를 찾을 수 없습니다.' });
    }

    // 총 개수 & 목록 병렬
    const [totalItemCount, users] = await Promise.all([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          employeeNumber: true,
          phoneNumber: true,
          company: { select: { companyName: true } },
        },
      }),
    ]);

    const totalPages = Math.max(Math.ceil(totalItemCount / pageSize), 1);

    return res.json({
      currentPage: page,
      totalPages,
      totalItemCount,
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        employeeNumber: u.employeeNumber,
        phoneNumber: u.phoneNumber,
        company: { companyName: u.company?.companyName ?? null },
      })),
    });
  } catch (err) {
    next(err);
  }
}




export default { getCompanyUsers };



