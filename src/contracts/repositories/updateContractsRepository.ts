import createError from 'http-errors';
import prisma from '../../lib/prisma.js';

import type { Prisma } from '@prisma/client';

export const updateContractsRepository = {
  // 계약 조회
  findById: async (contractId: number) => {
    return prisma.contracts.findUnique({
      where: { id: contractId },
      include: { meetings: true, documents: true },
    });
  },

  // 업데이트 response 계약 조회
  findByIdForResponse: async (contractId: number) => {
    return prisma.contracts.findUnique({
      where: { id: contractId },
      include: {
        user: true,
        customer: true,
        car: { include: { carModel: true } },
        meetings: { include: { alarms: true } },
      },
    });
  },

  // 계약 수정
  updateContract: async (
    contractId: number,
    data: Prisma.ContractsUpdateInput,
  ) => {
    const { car, ...rest } = data;

    const updateData: Prisma.ContractsUpdateInput = {
      ...rest,
      ...(car ? { car } : {}), // car가 있을 때만 포함
    };

    return prisma.contracts.update({
      where: { id: contractId },
      data: updateData,
      include: {
        user: true,
        customer: true,
        car: {
          include: { carModel: true },
        },
        meetings: {
          include: {
            alarms: true,
          },
        },
      },
    });
  },

  // 미팅 업데이트
  updateMeetings: async (
    contractId: number,
    meetings: { id?: number; date: string; alarms: string[] }[],
  ) => {
    // 기존 계약에 연결된 미팅 삭제 (알람 포함))
    await prisma.meetings.deleteMany({ where: { contractId } });

    // 미팅 생성 + 알람 생성 병렬 처리
    const meetingPromises = meetings.map(async (m) => {
      const meetingDate = new Date(m.date);
      if (isNaN(meetingDate.getTime())) {
        throw createError(
          400,
          `유효하지 않은 미팅입니다. 입력된 값: ${m.date}`,
        );
      }

      const meeting = await prisma.meetings.create({
        data: { date: meetingDate, contractId },
      });

      const alarmPromises = (m.alarms || []).map((alarmTime) => {
        const alarmDate = new Date(alarmTime);
        if (isNaN(alarmDate.getTime())) {
          throw createError(
            400,
            `유효하지 않은 알람입니다. 입력된 값: ${m.date}`,
          );
        }

        return prisma.alarms.create({
          data: { time: alarmDate, meetingId: meeting.id },
        });
      });

      await Promise.all(alarmPromises);

      return {
        ...meeting,
        alarms: (m.alarms || []).map((time) => ({ time: new Date(time) })),
      };
    });

    return Promise.all(meetingPromises);
  },

  // 계약 문서 업데이트
  updateContractDocuments: async (
    contractId: number, // 연결할 계약 id
    documents: { id: number; originalName: string }[], // 변경할 계약서 (이미 DB에 들어있음)
  ) => {
    // 기존 계약서 중 새로 요청 받은 데이터 목록에 없는 데이터 삭제
    const newDocIds = documents.map((d) => d.id);

    await prisma.contractDocuments.deleteMany({
      where: {
        contractId,
        id: { notIn: newDocIds },
      },
    });

    // 새로 추가된 계약서를 계약에 연결
    for (const doc of documents) {
      await prisma.contractDocuments.update({
        where: { id: doc.id },
        data: { contractId },
      });
    }
  },
};
