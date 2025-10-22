import prisma from '../../lib/prisma.js';

// 연결 계약이 없는 차량만 조회
export const getCarsListForContractRepository = async () => {
  const cars = await prisma.cars.findMany({
    where: {
      contract: null,
    },
    include: {
      carModel: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return cars;
};
