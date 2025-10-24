import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';

export const companyRepository = {
  // 회사 수정
  async updateCompanyById(
    companyId: number,
    data: { companyName: string; companyCode: string },
  ) {
    const company = await prisma.companies.update({
      where: { id: companyId },
      data: {
        companyName: data.companyName,
        companyCode: data.companyCode,
      },
    });

    const userCount = await prisma.users.count({ where: { companyId } });

    return {
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount,
    };
  },

  // 회사 등록
  async findByCode(companyCode: string) {
    return prisma.companies.findUnique({
      where: { companyCode },
    });
  },

  async create(companyName: string, companyCode: string) {
    return prisma.companies.create({
      data: { companyName, companyCode },
    });
  },

  // 회사 삭제
  async deleteCompanyById(companyId: number) {
    await prisma.companies.delete({ where: { id: companyId } });
    return { message: '회사 삭제 성공' };
  },

  // 회사 목록 조회
  async findAll(
    page: number,
    pageSize: number,
    searchBy?: string,
    keyword?: string,
  ) {
    const skip = (page - 1) * pageSize;

    // ✅ 검색 조건 설정
    const field = searchBy ?? 'companyName';

    const where = keyword
      ? {
          [field]: {
            contains: keyword,
          },
        }
      : {};

    const [companies, totalItemCount] = await Promise.all([
      prisma.companies.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { user: true },
          },
        },
        orderBy: { id: 'desc' },
      }),
      prisma.companies.count({ where }),
    ]);

    return { companies, totalItemCount };
  },

  // 회사별 유저 목록 조회
  async findCompanyUsers(
    page: number,
    pageSize: number,
    searchBy?: string,
    keyword?: string,
  ) {
    const skip = (page - 1) * pageSize;

    const base: Prisma.UsersWhereInput = { isAdmin: false };
    const kw = keyword?.trim();
    const ci = (v: string) => ({ contains: v, mode: 'insensitive' as const });
    let where: Prisma.UsersWhereInput = base;

    // 검색 조건 처리
    if (kw) {
      switch (searchBy) {
        case 'companyName':
          where = {
            ...base,
            company: { companyName: ci(kw) },
          };
          break;
        case 'name':
          where = { name: ci(kw) };
          break;
        case 'email':
          where = { email: ci(kw) };
          break;
        default:
          where = {
            ...base,
            OR: [
              { name: ci(kw) },
              { email: ci(kw) },
              { employeeNumber: ci(kw) },
              { phoneNumber: ci(kw) },
              { company: { companyName: ci(kw) } },
            ],
          };
      }
    }

    const [users, totalItemCount] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          employeeNumber: true,
          phoneNumber: true,
          company: { select: { companyName: true } },
        },
      }),
      prisma.users.count({ where }),
    ]);

    return { users, totalItemCount };
  },

  async findById(companyId: number) {
    return prisma.companies.findUnique({ where: { id: companyId } });
  },
};
