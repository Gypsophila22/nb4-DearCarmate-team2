import createError from 'http-errors';

import contractRepository from '../repositories/index.js';

interface CreateContractInput {
  carId: number;
  customerId: number; // 고객
  meetings: { date: string; alarms: string[] }[]; // 미팅 일정
  userId: number; // 계약 담당자
}

export const createContractsService = async (data: CreateContractInput) => {
  // 차량 존재 확인 및 보유중인지 상태 체크
  const car = await contractRepository.findCar(data.carId);
  if (!car) {
    throw createError(404, '존재하지 않는 차량입니다');
  }
  const contractExisting = await contractRepository.contractFindExisting(
    data.carId,
  );
  if (contractExisting) {
    throw createError(409, '이미 계약이 존재하는 차량입니다');
  }

  // 고객 존재 확인
  const customer = await contractRepository.findCustomer(data.customerId);
  if (!customer) {
    throw createError(404, '존재하지 않는 고객입니다');
  }

  // 유저(계약 담당자) 존재 확인
  const user = await contractRepository.findUser(data.userId);
  if (!user) {
    throw createError(400, '잘못된 요청입니다');
  }

  // 계약 생성
  const contract = await contractRepository.create.createContract({
    carId: data.carId,
    customerId: data.customerId,
    contractPrice: car.price,
    userId: data.userId,
  });

  // 미팅 및 알람 생성
  const meetings = await contractRepository.create.createMeetingsAndAlarms(
    contract.id,
    data.meetings,
  );

  // 차량 상태를 '계약 진행 중'으로 변경
  await contractRepository.create.updateCarStatus(data.carId);

  return {
    id: contract.id,
    status: contract.status,
    resolutionDate: contract.resolutionDate,
    contractPrice: contract.contractPrice,
    meetings: meetings.map((m) => ({
      date: m.date,
      alarms: m.alarms?.map((a) => a.time) ?? [], // undefined이면 빈 배열로 처리
    })),
    user,
    customer,
    car: {
      id: car.id,
      model: car.carModel.model,
    },
  };
};
