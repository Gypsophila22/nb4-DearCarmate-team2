import { CarStatus, ContractsStatus, PrismaClient } from '@prisma/client';

export const createContractsRepository = {
  // 차량 정보 조회
  findCarByIdForContract: async (prisma: PrismaClient, carId: number) => {
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
  findCustomerByIdForContract: async (
    prisma: PrismaClient,
    customerId: number,
  ) => {
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, name: true },
    });
    if (!customer) throw new Error(`고객을 찾을 수 없습니다`);
    return customer;
  },

  // 미팅 및 알람 생성
  createMeetingsAndAlarms: async (
    prisma: PrismaClient,
    contractId: number,
    meetings: { date: string; alarms: string[] }[],
  ) => {
    const createdMeetings = [];
    for (const m of meetings) {
      // 미팅 생성
      const meeting = await prisma.meetings.create({
        data: { date: new Date(m.date), contractId },
      });

      // 미팅별 알람 생성
      for (const a of m.alarms) {
        await prisma.alarms.create({
          data: { time: new Date(a), meetingId: meeting.id },
        });
      }

      createdMeetings.push({
        ...meeting,
        alarms: m.alarms.map((time) => ({ time: new Date(time) })),
      });
    }
    return createdMeetings;
  },

  // 차량 상태 업데이트 (보유 중 -> 계약 진행 중)
  updateCarStatus: async (
    prisma: PrismaClient,
    carId: number,
    status: CarStatus,
  ) => {
    return prisma.cars.update({ where: { id: carId }, data: { status } });
  },

  // 계약 생성
  create: async (
    prisma: PrismaClient,
    data: {
      carId: number; // 차량
      customerId: number; // 고객
      contractPrice: number; // 계약 가격
      userId: number; // 계약 담당자
    },
  ) => {
    return prisma.contracts.create({
      data: {
        carId: data.carId, // 차량
        customerId: data.customerId, // 고객
        userId: data.userId, // 로그인 사용자 (계약 담당자))
        status: ContractsStatus.carInspection, // 계약 상태: 차량 확인
        date: new Date(), // 계약 생성일
        resolutionDate: new Date(), // 계약 완료 시간
        contractPrice: data.contractPrice, // 차량 가격 기본값
      },
    });
  },
};
