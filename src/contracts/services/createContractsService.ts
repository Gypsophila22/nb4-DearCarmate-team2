import contractRepository from '../repositories/index.js';

interface CreateContractInput {
  carId: number;
  customerId: number; // 고객
  meetings: { date: string; alarms: string[] }[]; // 미팅 일정
  userId: number; // 계약 담당자
}

interface Alarm {
  time: Date;
}

interface Meeting {
  date: Date;
  alarms: Alarm[];
}

export const createContractsService = async (data: CreateContractInput) => {
  // 차량 존재 확인 및 보유중인지 상태 체크
  const car = await contractRepository.findCar(data.carId);
  // 고객 존재 확인
  const customer = await contractRepository.findCustomer;
  // 유저(계약 담당자) 존재 확인
  const user = await contractRepository.findUser;

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
    meetings: meetings.map((m: Meeting) => ({
      date: m.date,
      alarms: m.alarms.map((a: Alarm) => a.time),
    })),
    user,
    customer,
    car: {
      id: car.id,
      model: car.carModel.model,
    },
  };
};
