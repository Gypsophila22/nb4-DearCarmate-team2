import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

export async function getContractDocuments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });

    const page = Math.max(
      parseInt((req.query.page as string) ?? '1', 10) || 1,
      1
    );
    const pageSizeRaw =
      parseInt((req.query.pageSize as string) ?? '10', 10) || 10;
    const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100);
    const skip = (page - 1) * pageSize;

    const searchBy = (req.query.searchBy as string | undefined)?.trim();
    const keyword = (req.query.keyword as string | undefined)?.trim();

    // searchBy는 contractName만 허용
    if (searchBy && searchBy !== 'contractName') {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 회사 + 고객명 검색
    const baseWhere: any = { user: { companyId: req.user.companyId } };
    const where =
      searchBy === 'contractName' && keyword
        ? {
            ...baseWhere,
            customer: {
              name: { contains: keyword, mode: 'insensitive' as const },
            },
          }
        : baseWhere;

    const [totalItemCount, contracts] = await Promise.all([
      prisma.contracts.count({ where }),
      prisma.contracts.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' }, // 최신 계약 순
        include: {
          _count: { select: { documents: true } }, // ContractDocuments[] 역관계
          user: { select: { name: true } }, // 담당자
          car: { select: { carNumber: true } }, // 차량번호
          documents: {
            select: { id: true, originalName: true }, // 파일명
            orderBy: { createdAt: 'desc' },
          },
          customer: { select: { name: true } }, // 고객명 → contractName으로 사용
        },
      }),
    ]);

    const totalPages = Math.max(Math.ceil(totalItemCount / pageSize), 1);

    return res.status(200).json({
      currentPage: page,
      totalPages,
      totalItemCount,
      data: contracts.map((c) => ({
        id: c.id,
        contractName: c.customer?.name ?? '', // 명세의 contractName
        resolutionDate: c.resolutionDate,
        documentsCount: c._count.documents,
        manager: c.user?.name ?? '',
        carNumber: c.car?.carNumber ?? '',
        documents: c.documents.map((d) => ({
          id: d.id,
          fileName: d.originalName,
        })),
      })),
    });
  } catch (err) {
    next(err);
  }
}
