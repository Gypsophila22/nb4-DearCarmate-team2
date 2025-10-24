import { contractRepository } from '../repositories/contract.repository.js';
import createError from 'http-errors';
import prisma from '../../lib/prisma.js';
import { sendContractDocsLinkedEmail } from '../../contract-documents/services/contract-document.send-email.service.js';
import type { UpdateContractInput } from '../repositories/types/contract.types.js';
import { CarStatus, ContractsStatus } from '@prisma/client';

// 상태 매핑 헬퍼
function carStatusFor(status: ContractsStatus): CarStatus {
  switch (status) {
    case ContractsStatus.contractSuccessful:
      return CarStatus.contractCompleted; // 계약 성공 → 차량 '계약 완료'
    case ContractsStatus.contractFailed:
      return CarStatus.possession; // 계약 실패 → 차량 '보유중'
    default:
      // carInspection / priceNegotiation / contractDraft 등 진행중 단계
      return CarStatus.contractProceeding; // 진행중 → 차량 '계약 진행 중'
  }
}

// 계약 상태 변경

export const contractUpdateService = async ({
  userId,
  contractId,
  data,
}: {
  userId: number;
  contractId: number;
  data: UpdateContractInput;
}) => {
  // 계약 존재 여부 확인
  const contract = await contractRepository.contractFindById(contractId);
  if (!contract) {
    throw createError(404, '존재하지 않는 계약입니다');
  }
  if (contract.userId !== userId) {
    throw createError(403, '담당자만 수정이 가능합니다');
  }
  if (data.carId) {
    // 차량 존재 확인 및 보유중인지 체크
    const car = await contractRepository.findCar(data.carId);
    if (!car) {
      throw createError(404, '존재하지 않는 차량입니다');
    }
  }

  const before = await prisma.contracts.findUnique({
    where: { id: contractId },
    select: { carId: true, status: true },
  });
  if (!before) throw createError(404, '계약을 찾을 수 없습니다.');

  // 계약 정보 업데이트 (undefined인 필드를 data 객체에서 제외)
  await contractRepository.update({
    contractId,
    data: {
      ...(data.status && { status: data.status }),
      ...(data.contractPrice !== undefined && {
        contractPrice: { set: data.contractPrice },
      }),
      ...(data.resolutionDate !== undefined && {
        resolutionDate: data.resolutionDate
          ? new Date(data.resolutionDate)
          : null,
      }),
      ...(data.userId && { user: { connect: { id: data.userId } } }),
      ...(data.customerId && {
        customer: { connect: { id: data.customerId } },
      }),
      ...(data.carId !== undefined &&
        data.carId !== null && {
          car: { connect: { id: data.carId } },
        }),
    },
  });
  const after = await prisma.contracts.findUnique({
    where: { id: contractId },
    select: { carId: true, status: true },
  });
  if (!after) throw createError(404, '계약을 찾을 수 없습니다.');
  // 1. carId가 바뀌었으면, 이전 차량을 진행중 > 보유중으로 되돌리기
  if (before.carId !== null && after.carId !== before.carId) {
    await prisma.cars.updateMany({
      where: { id: before.carId, status: CarStatus.contractProceeding },
      data: { status: CarStatus.possession },
    });
  }
  // 2. 현재 계약 상태에 맞춰 (새) 차량 상태 설정
  const targetCarStatus = carStatusFor(after.status as ContractsStatus);
  if (targetCarStatus === CarStatus.possession) {
    await prisma.cars.updateMany({
      where: { id: after.carId, status: CarStatus.contractProceeding },
      data: { status: CarStatus.possession },
    });
  } else {
    await prisma.cars.updateMany({
      where: { id: after.carId },
      data: { status: targetCarStatus },
    });
  }

  // 미팅 정보 업데이트
  if (data.meetings) {
    if (data.meetings.length === 0) {
      await prisma.alarms.deleteMany({
        where: {
          meeting: {
            contractId: contractId,
          },
        },
      });
      await prisma.meetings.deleteMany({
        where: { contractId: contractId },
      });
    } else {
      await contractRepository.updateMeetings(contractId, data.meetings);
    }
  }

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
        where: { contractId: contractId },
        data: { contractId: null },
      });
    } else {
      const validDocs = data.contractDocuments.filter(
        (doc): doc is { id: number; fileName: string } =>
          !!doc.id && !!doc.fileName,
      );

      if (validDocs.length > 0) {
        await contractRepository.updateContractDocuments(
          contractId,
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
            return was === null && now === contractId; // 이번 PATCH로 null → 이 계약 id
          })
          .map((r) => r.id);
        if (newlyLinked.length > 0) {
          sendContractDocsLinkedEmail(newlyLinked)
            .then(() => console.log('[email] 발송 완료'))
            .catch((err) => console.error('[email] 발송 실패', err));
        }
      }
    }
  }

  // 최종 조회
  const contractResponse =
    await contractRepository.findByIdForResponse(contractId);

  if (!contractResponse) {
    throw createError(404, '계약을 찾을 수 없습니다.');
  }

  const response = {
    id: contractResponse.id,
    status: contractResponse.status,
    resolutionDate: contractResponse.resolutionDate
      ? contractResponse.resolutionDate.toISOString()
      : null,
    contractPrice: contractResponse.contractPrice,
    meetings: contractResponse.meetings.map((m) => ({
      date: m.date.toISOString().split('T')[0], // YYYY-MM-DD
      alarms: m.alarms.map((a) => a.time.toISOString()),
    })),
    user: {
      id: contractResponse.user.id,
      name: contractResponse.user.name,
    },
    customer: {
      id: contractResponse.customer.id,
      name: contractResponse.customer.name,
    },
    car: {
      id: contractResponse.car.id,
      model: contractResponse.car.carModel.model,
    },
  };
  return response;
};
