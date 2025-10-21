import prisma from '../../lib/prisma.js';

export const getCarsListForContractRepository = async () => {
  // 상태가 보유중 'possession'인 차량 조회
  const cars = await prisma.cars.findMany({
    where: { status: 'possession' },
    include: {
      carModel: true, // carModel 조인
    },
    orderBy: { id: 'asc' },
  });
  return cars;
};
