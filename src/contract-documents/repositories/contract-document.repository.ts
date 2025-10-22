import prisma from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

class ContractDocumentRepository {
  findByIdForCompany(params: {
    contractDocumentId: number;
    companyId: number;
  }) {
    const { contractDocumentId, companyId } = params;
    return prisma.contractDocuments.findFirst({
      where: { id: contractDocumentId, companyId },
      select: {
        id: true,
        originalName: true,
        storedName: true,
        path: true,
        url: true,
        mimeType: true,
        contractId: true,
        createdAt: true,
      },
    });
  }

  findByIdWithJoins(id: number) {
    // 메일 보낼 때 필요한 조인 전부 포함
    return prisma.contractDocuments.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            customer: true,
            user: true,
            car: { include: { carModel: true } },
          },
        },
      },
    });
  }

  findDraftableContracts(companyId: number) {
    return prisma.contracts.findMany({
      where: { user: { companyId } },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        car: {
          select: {
            carNumber: true,
            carModel: { select: { model: true } },
          },
        },
        customer: { select: { name: true } },
      },
    });
  }

  count(where: Prisma.ContractsWhereInput) {
    return prisma.contracts.count({ where });
  }

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
  }

  create(params: {
    companyId: number;
    uploaderId: number;
    originalName: string;
    storedName: string;
    mimeType: string;
    size: number;
    path: string | null;
    contractId?: number | null | undefined;
  }) {
    return prisma.contractDocuments.create({
      data: {
        companyId: params.companyId,
        uploaderId: params.uploaderId,
        originalName: params.originalName,
        storedName: params.storedName,
        mimeType: params.mimeType,
        size: params.size,
        path: params.path,
        contractId: params.contractId ?? null,
      },
      select: { id: true },
    });
  }
}

export const contractDocumentRepository = new ContractDocumentRepository();
