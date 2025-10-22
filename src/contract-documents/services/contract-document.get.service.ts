import { contractDocumentRepository } from '../repositories/contract-document.repository.js';
import { Prisma } from '@prisma/client';

type Actor = { id: number; companyId: number; isAdmin?: boolean };

type GetContractDocumentsArgs = {
  actor: Actor;
  page: number;
  pageSize: number;
  searchBy?: string;
  keyword?: string;
};

export async function getDocumentsService({
  actor,
  page,
  pageSize,
  searchBy,
  keyword,
}: GetContractDocumentsArgs) {
  // 회사
  const baseWhere: Prisma.ContractsWhereInput = {
    user: { companyId: actor.companyId },
  };

  // searchBy는 contractName만 허용
  let where: Prisma.ContractsWhereInput = baseWhere;
  if (searchBy && searchBy === 'contractName' && keyword) {
    where = {
      ...baseWhere,
      customer: { name: { contains: keyword, mode: 'insensitive' } },
    };
  }

  const skip = (page - 1) * pageSize;

  const [totalItemCount, contracts] = await Promise.all([
    contractDocumentRepository.count(where),
    contractDocumentRepository.findPage({ where, skip, take: pageSize }),
  ]);

  const totalPages = Math.max(Math.ceil(totalItemCount / pageSize), 1);

  /* 응답 DTO 매핑
   */
  return {
    currentPage: page,
    totalPages,
    totalItemCount,
    data: contracts.map((c) => ({
      id: c.id,
      contractName: c.customer?.name ?? '',
      resolutionDate: c.resolutionDate,
      documentCount: c._count.documents,
      userName: c.user?.name ?? '',
      carNumber: c.car?.carNumber ?? '',
      documents: c.documents.map((d) => ({
        id: d.id,
        fileName: d.originalName,
      })),
    })),
  };
}
