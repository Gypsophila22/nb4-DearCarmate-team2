import { CarStatus, ContractsStatus } from "@prisma/client";

import prisma from "../../lib/prisma.js";

export const createContractsRepository = {
  // 차량 정보 조회
  findCarByIdForContract: async (carId: number) => {
    const car = await prisma.cars.findUnique({
      where: { id: carId },
      select: {
        id: true,
        price: true, // 차량 가격
        status: true, // 차량 상태
        carModel: { select: { model: true } }, // 차량 이름
      },
    });
    if (!car) throw new Error(`차량을 찾을 수 없습니다`);
    return {
      id: car.id,
      price: car.price,
      status: car.status,
      model: car.carModel.model,
    };
  },

  // 고객 정보 조회
  findCustomerByIdForContract: async (customerId: number) => {
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, name: true },
    });
    if (!customer) throw new Error(`고객을 찾을 수 없습니다`);
    return customer;
  },

  // 미팅 및 알람 생성
  createMeetingsAndAlarms: async (
    contractId: number,
    meetings: { date: string; alarms: string[] }[],
  ) => {
    // 미팅 생성 병렬 처리
    const createMeetings = await Promise.all(
      meetings.map((m) =>
        prisma.meetings.create({
          data: { date: new Date(m.date), contractId },
        }),
      ),
    );

    // 알람 생성 병렬 처리
    const alarmPromises = createMeetings.flatMap((meeting, i) => {
      const alarms = meetings[i]?.alarms;
      if (!alarms || alarms.length === 0) return []; // alarms 없으면 건너뜀
      return alarms.map((a) =>
        prisma.alarms.create({
          data: { time: new Date(a), meetingId: meeting.id },
        }),
      );
    });
    await Promise.all(alarmPromises);

    return createMeetings.map((meeting, i) => ({
      ...meeting,
      alarms: meetings[i]?.alarms.map((time) => ({ time: new Date(time) })),
    }));
  },

  // 차량 상태 업데이트 (보유 중 -> 계약 진행 중)
  updateCarStatus: async (carId: number) => {
    const status = CarStatus.contractProceeding; // 계약 진행 중
    return prisma.cars.update({ where: { id: carId }, data: { status } });
  },

  // 계약 생성
  createContract: async (data: {
    carId: number; // 차량
    customerId: number; // 고객
    contractPrice: number; // 계약 가격
    userId: number; // 계약 담당자
  }) => {
    return prisma.contracts.create({
      data: {
        carId: data.carId, // 차량
        customerId: data.customerId, // 고객
        userId: data.userId, // 로그인 사용자 (계약 담당자))
        status: ContractsStatus.carInspection, // 계약 상태: 차량 확인
        resolutionDate: new Date(), // 계약 완료 시간
        contractPrice: data.contractPrice, // 차량 가격 기본값
      },
    });
  },
};
