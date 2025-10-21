import prisma from "../../lib/prisma.js";

/**
 * 차량 존재 확인 및 상테 체크 레포지토리
 * @param carId
 */
export const findCarsForContractRepository = async (carId: number) => {
  const car = await prisma.cars.findUnique({
    where: { id: carId },
    include: {
      carModel: true, // carModel 관계 포함
    },
  });

  return car;
};
