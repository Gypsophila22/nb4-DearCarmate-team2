import type { Request, Response, NextFunction } from 'express';
import prisma from '../../config/prisma.js';


// ✅ 열거형 형태로 검색 키 정의
const SEARCHABLE_FIELDS = {
  NAME: "name",
  EMAIL: "email",
  EMPLOYEENUMBER: "employeeNumber",
  PHONENUMBER: "phoneNumber",
} as const;
type SearchBy = (typeof SEARCHABLE_FIELDS)[keyof typeof SEARCHABLE_FIELDS];


async function getCompanyUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // ✅ path params
    const companyIdNum = Number(req.params.companyId);
    if (!Number.isInteger(companyIdNum) || companyIdNum <= 0) {
      return res.status(400).json({ message: '잘못된 회사 ID입니다.' });
    }


    // ✅ query params (가독성 위주)
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;


    // ✅ 문자열 타입 안전하게 처리
    const rawSearchBy =
      typeof req.query.searchBy === 'string' ? req.query.searchBy.trim() : undefined;
    const keyword =
      typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';


    // ✅ 유효하지 않거나 undefined면 기본값 "name"
    const validValues = Object.values(SEARCHABLE_FIELDS);
    const searchBy: SearchBy = validValues.includes(rawSearchBy as SearchBy)
      ? (rawSearchBy as SearchBy)
      : SEARCHABLE_FIELDS.NAME;


    // ✅ 회사 존재 여부
    const companyExists = await prisma.companies.findUnique({
      where: { id: companyIdNum },
      select: { id: true },
    });
    if (!companyExists) {
      return res.status(404).json({ message: '회사를 찾을 수 없습니다.' });
    }


    // ✅ Prisma 내부에서 조건 구성 (any 제거)
    const where: Record<string, unknown> = {
      companyId: companyIdNum,
      ...(keyword ? { [searchBy]: { contains: keyword, mode: 'insensitive' as const } } : {}),
    };


    // ✅ 총 개수 & 목록 병렬 조회
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


    // ✅ 응답
    return res.status(200).json({
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



