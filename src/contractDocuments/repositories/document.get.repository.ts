import prisma from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

export const documentGetRepository = {
  count(where: Prisma.ContractsWhereInput) {
    return prisma.contracts.count({ where });
  },

  findPage(params: {
    where: Prisma.ContractsWhereInput;
    skip: number;
    take: number;
  }) {
    const { where, skip, take } = params;
    return prisma.contracts.findMany({
      where,
      skip,
      take,
      orderBy: { date: 'desc' }, // 최신 계약 순
      include: {
        _count: { select: { documents: true } }, // ContractDocuments 역관계 카운트
        user: { select: { name: true } }, // 담당자
        car: { select: { carNumber: true } }, // 차량번호
        documents: {
          select: { id: true, originalName: true }, // 파일명
          orderBy: { createdAt: 'desc' },
        },
        customer: { select: { name: true } }, // 고객명 → contractName
      },
    });
  },
};
