import prisma from '../../config/prisma.js';
import { createContractsRepository } from '../repositories/createContractsRepository.js';

interface CreateContractInput {
  carId: number;
  customerId: number;
  meetings: { date: string; alarms: string[] }[];
  userId: number; // 로그인 사용자 (계약 담당자)
}

interface Alarm {
  time: Date;
}

interface Meeting {
  date: Date;
  alarms: Alarm[];
}

export const createContractsService = async (data: CreateContractInput) => {
  // 차량 확인
  const car = await createContractsRepository.findCarByIdForContract(
    prisma,
    data.carId,
  );
  if (car.status !== 'possession') {
    throw new Error('보유 중인 차량만 계약할 수 있습니다');
  }
  // 고객 확인
  const customer = await prisma.customers.findUnique({
    where: { id: data.customerId },
    select: { id: true, name: true },
  });
  if (!customer) {
    throw new Error(`존재하지 않는 고객입니다`);
  }

  // 계약 담당자 정보 조회
  const user = await prisma.users.findUnique({
    where: { id: data.userId },
    select: { id: true, name: true },
  });
  if (!user) {
    throw new Error(`존재하지 않는 유저입니다`);
  }

  // 계약 생성
  const contract = await createContractsRepository.create(prisma, {
    carId: data.carId,
    customerId: data.customerId,
    contractPrice: car.price,
    userId: data.userId,
  });

  // 미팅 및 알람 생성
  const meetings = await createContractsRepository.createMeetingsAndAlarms(
    prisma,
    contract.id,
    data.meetings,
  );

  // 차량 상태를 '계약 진행 중'으로 변경
  await createContractsRepository.updateCarStatus(
    prisma,
    data.carId,
    'contractProceeding',
  );

  return {
    id: contract.id,
    status: contract.status,
    resolutionDate: contract.resolutionDate,
    contractPrice: contract.contractPrice,
    meetings: meetings.map((m: Meeting) => ({
      date: m.date,
      alarms: m.alarms.map((a: Alarm) => a.time),
    })),
    user,
    customer,
    car: {
      id: car.id,
      model: car.model,
    },
  };
};
