import { ContractsStatus } from '@prisma/client';

import prisma from '../../lib/prisma.js';
import contractRepository from '../repositories/index.js';
import { sendContractDocsLinkedEmail } from '../../contractDocuments/services/contract-document.send-email.service.js';

// 계약 상태 변경, 계약서 관련 말고는 프론트에서 기존 정보 다 입력된채로 넘김
interface UpdateContractInput {
  contractId: number;
  status?: ContractsStatus; // 계약 상태
  resolutionDate?: string; // 계약 종료일
  contractPrice?: number; // 계약 가격
  meetings?: { id?: number; date: string; alarms: string[] }[]; // 일정
  contractDocuments?: { id?: number; fileName?: string }[]; // 계약서
  userId?: number; // 담당자
  customerId?: number; // 고객
  carId?: number; // 차량
}

export const updateContractsService = async (data: UpdateContractInput) => {
  // 계약 존재 여부 확인
  const contract = await contractRepository.update.findById(
    prisma,
    data.contractId,
  );
  if (!contract) throw new Error('존재하지 않는 계약입니다');

  // 계약 정보 업데이트 (undefined인 필드를 data 객체에서 제외)
  const updatedContract = await contractRepository.update.updateContract(
    prisma,
    data.contractId,
    {
      ...(data.status && { status: data.status }),
      ...(data.contractPrice !== undefined && {
        contractPrice: { set: data.contractPrice },
      }),
      ...(data.resolutionDate && {
        resolutionDate: new Date(data.resolutionDate),
      }),
      ...(data.userId && { user: { connect: { id: data.userId } } }),
      ...(data.customerId && {
        customer: { connect: { id: data.customerId } },
      }),
      ...(data.carId && { car: { connect: { id: data.carId } } }),
    },
  );

  // 미팅 정보 업데이트
  if (data.meetings && data.meetings.length > 0) {
    await contractRepository.update.updateMeetings(
      prisma,
      data.contractId,
      data.meetings,
    );
  }

  // 계약 문서 업데이트
  // if (data.contractDocuments && data.contractDocuments.length > 0) {
  //   const validDocs = data.contractDocuments.filter(
  //     (doc): doc is { id: number; fileName: string } =>
  //       !!doc.id && !!doc.fileName,
  //   );

  //   if (validDocs.length > 0) {
  //     await contractRepository.update.updateContractDocuments(
  //       prisma,
  //       data.contractId,
  //       validDocs.map((doc) => ({
  //         id: doc.id,
  //         originalName: doc.fileName,
  //       })),
  //     );
  //   }
  // }

  // 계약 문서 업데이트 수정(업로드>계약 수정 흐름이라 불가피하게 변경했습니다)
  if (data.contractDocuments !== undefined) {
    const touchingIds = data.contractDocuments
      .map((d) => d?.id)
      .filter((v): v is number => typeof v === 'number');
    const beforeRows = touchingIds.length
      ? await prisma.contractDocuments.findMany({
          where: { id: { in: touchingIds } },
          select: { id: true, contractId: true },
        })
      : [];
    const beforeMap = new Map(beforeRows.map((r) => [r.id, r.contractId]));

    if (data.contractDocuments.length === 0) {
      // 빈 배열이면 이 계약의 모든 문서 연결 해제
      await prisma.contractDocuments.updateMany({
        where: { contractId: data.contractId },
        data: { contractId: null },
      });
    } else {
      const validDocs = data.contractDocuments.filter(
        (doc): doc is { id: number; fileName: string } =>
          !!doc.id && !!doc.fileName,
      );

      if (validDocs.length > 0) {
        await contractRepository.update.updateContractDocuments(
          prisma,
          data.contractId,
          validDocs.map((doc) => ({
            id: doc.id,
            originalName: doc.fileName,
          })),
        );
        const afterRows = await prisma.contractDocuments.findMany({
          where: { id: { in: validDocs.map((d) => d.id) } },
          select: { id: true, contractId: true },
        });
        const newlyLinked = afterRows
          .filter((row) => {
            const was = beforeMap.get(row.id) ?? null; // 이전 contractId
            const now = row.contractId ?? null; // 현재 contractId
            return was === null && now === data.contractId; // 이번 PATCH로 null → 이 계약 id
          })
          .map((r) => r.id);
        await sendContractDocsLinkedEmail(newlyLinked);
      }
    }
  }

  const updateContractResponse = {
    id: updatedContract.id,
    status: updatedContract.status,
    resolutionDate: updatedContract.resolutionDate.toISOString(),
    contractPrice: updatedContract.contractPrice,
    meetings: updatedContract.meetings.map((m) => ({
      date: m.date.toISOString().split('T')[0], // yyyy-mm-dd
      alarms: m.alarms.map((a) => a.time.toISOString()),
    })),
    user: {
      id: updatedContract.user.id,
      name: updatedContract.user.name,
    },
    customer: {
      id: updatedContract.customer.id,
      name: updatedContract.customer.name,
    },
    car: {
      id: updatedContract.car.id,
      model: updatedContract.car.carModel.model,
    },
  };

  return updateContractResponse;
};
