import prisma from '../../lib/prisma.js';

/**
 * 계약 존재 확인 레포지토리
 * @param contractId
 */
export const findContractsRepository = async (contractId: number) => {
  const contract = await prisma.contracts.findUnique({
    where: { id: contractId },
    include: {
      user: true,
    },
  });
  return contract;
};
