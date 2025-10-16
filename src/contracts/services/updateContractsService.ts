import { ContractsStatus } from '@prisma/client';

import contractRepository from '../repositories/index.js';

// 계약 상태 변경
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
  await contractRepository.findContract(data.contractId);
  // 차량 존재 확인 및 보유중인지 체크
  if (data.carId) {
    await contractRepository.findCar(data.carId);
  }

  // 계약 정보 업데이트 (undefined인 필드를 data 객체에서 제외)
  const updatedContract = await contractRepository.update.updateContract(
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
      ...(data.carId !== undefined &&
        data.carId !== null && {
          car: { connect: { id: data.carId } },
        }),
    },
  );

  // 미팅 정보 업데이트
  if (data.meetings && data.meetings.length > 0) {
    await contractRepository.update.updateMeetings(
      data.contractId,
      data.meetings,
    );
  }

  // 계약 문서 업데이트
  if (data.contractDocuments && data.contractDocuments.length > 0) {
    const validDocs = data.contractDocuments.filter(
      (doc): doc is { id: number; fileName: string } =>
        !!doc.id && !!doc.fileName,
    );

    if (validDocs.length > 0) {
      await contractRepository.update.updateContractDocuments(
        data.contractId,
        validDocs.map((doc) => ({
          id: doc.id,
          originalName: doc.fileName,
        })),
      );
    }
  }

  const updateContractResponse = {
    id: updatedContract.id,
    status: updatedContract.status,
    resolutionDate: updatedContract.resolutionDate.toISOString(),
    contractPrice: updatedContract.contractPrice,
    meetings: updatedContract.meetings.map((m) => ({
      date: m.date.toISOString().split('T')[0],
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
