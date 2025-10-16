import prisma from '../../lib/prisma.js';

/**
 * 차량 존재 확인 및 상테 체크 레포지토리
 * @param carId
 */
export const findCarsForContractRepository = async (carId: number) => {
  const car = await prisma.cars.findUnique({
    where: { id: Number(carId) },
    include: {
      carModel: true, // carModel 관계 포함
    },
  });
  if (!car) {
    throw new Error('존재하지 않는 차량입니다');
  }
  if (car.status !== 'possession') {
    // 보유 중인 차량만 계약 가능
    throw new Error('보유 중인 차량이 아닙니다');
  }
  return car;
};
