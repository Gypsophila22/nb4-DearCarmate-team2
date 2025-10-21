import prisma from "../../lib/prisma.js";

/**
 * 차량으로 이미 존재하는 계약 조회
 */
export const contractFindExistingRepository = async (carId: number) => {
  const existingContract = await prisma.contracts.findUnique({
    where: { carId },
  });

  return existingContract;
};
