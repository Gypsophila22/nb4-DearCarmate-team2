import createError from "http-errors";

import { ContractsStatus } from "@prisma/client";

import prisma from "../../lib/prisma.js";
import contractRepository from "../repositories/index.js";

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

export const updateContractsService = async (
  userId: number,
  data: UpdateContractInput,
) => {
  // 계약 존재 여부 확인
  const contract = await contractRepository.findContract(data.contractId);
  if (!contract) {
    throw createError(404, "존재하지 않는 계약입니다");
  }
  if (contract.userId !== userId) {
    throw createError(403, "담당자만 삭제가 가능합니다");
  }
  if (data.carId) {
    // 차량 존재 확인 및 보유중인지 체크
    const car = await contractRepository.findCar(data.carId);
    if (!car) {
      throw new Error("존재하지 않는 차량입니다");
    }
    if (car.status !== "possession") {
      // 보유 중인 차량만 계약 가능
      throw new Error("보유 중인 차량이 아닙니다");
    }
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
  if (data.meetings) {
    if (data.meetings.length === 0) {
      // 빈 배열이면 기존 미팅과 알람 모두 삭제
      await prisma.alarms.deleteMany({
        where: {
          meeting: {
            contractId: data.contractId,
          },
        },
      });
      await prisma.meetings.deleteMany({
        where: { contractId: data.contractId },
      });
    } else {
      // 빈 배열이 아닌 경우 기존 로직: 추가/업데이트
      await contractRepository.update.updateMeetings(
        data.contractId,
        data.meetings,
      );
    }
  }

  // 계약 문서 업데이트
  if (data.contractDocuments !== undefined) {
    if (data.contractDocuments.length === 0) {
      // 빈 배열이면 이 계약의 모든 문서 삭제
      await prisma.contractDocuments.deleteMany({
        where: { contractId: data.contractId },
      });
    } else {
      // 빈 배열이 아닐 때 (유효한 것 필터링)
      const validDocs = data.contractDocuments.filter(
        (doc): doc is { id: number; fileName: string } =>
          !!doc.id && !!doc.fileName,
      );

      if (validDocs.length > 0) {
        // 기존 계약에 연결된 문서 조회
        const existingDocs = await prisma.contractDocuments.findMany({
          where: { contractId: data.contractId },
          select: { id: true },
        });

        const existingIds = existingDocs.map((doc) => doc.id);
        const incomingIds = validDocs.map((doc) => doc.id);

        // 삭제할 문서: 기존에는 있는데 incoming에는 없는 것
        const docsToDelete = existingIds.filter(
          (id) => !incomingIds.includes(id),
        );
        if (docsToDelete.length > 0) {
          await prisma.contractDocuments.deleteMany({
            where: { id: { in: docsToDelete } },
          });
        }

        // 새로 추가할 문서: incoming에는 있는데 기존에는 없는 것
        const docsToAdd = validDocs.filter(
          (doc) => !existingIds.includes(doc.id),
        );
        if (docsToAdd.length > 0) {
          await contractRepository.update.updateContractDocuments(
            data.contractId,
            docsToAdd.map((doc) => ({
              id: doc.id,
              originalName: doc.fileName,
            })),
          );
        }
      }
    }
  }

  // 최종 조회
  const contractResponse = await contractRepository.update.findByIdForResponse(
    data.contractId,
  );

  if (!contractResponse) {
    throw createError(404, "계약을 찾을 수 없습니다.");
  }

  const response = {
    id: contractResponse.id,
    status: contractResponse.status,
    resolutionDate: contractResponse.resolutionDate.toISOString(),
    contractPrice: contractResponse.contractPrice,
    meetings: contractResponse.meetings.map((m) => ({
      date: m.date.toISOString().split("T")[0], // YYYY-MM-DD
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
