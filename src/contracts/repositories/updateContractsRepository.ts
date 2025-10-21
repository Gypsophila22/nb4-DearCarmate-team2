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

  // 계약 수정
  updateContract: async (
    contractId: number,
    data: Prisma.ContractsUpdateInput,
  ) => {
    // car정보가 안 넘어오면 prisma에 안 보냄
    const cleanData = { ...data };
    if (!data.car) {
      delete (cleanData as any).car;
    }

    return prisma.contracts.update({
      where: { id: contractId },
      data,
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

    for (const m of meetings) {
      // 미팅 일정 생성
      const meeting = await prisma.meetings.create({
        data: {
          date: new Date(m.date), // 문자열을 Date 객체로 변환
          contractId, // 계약과 연결
        },
      });
      // 각 미팅에 대한 알림 생성
      for (const alarmTime of m.alarms) {
        await prisma.alarms.create({
          data: {
            time: new Date(alarmTime), // 알림 시간
            meetingId: meeting.id, // 미팅과 연결
          },
        });
      }
    }
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
