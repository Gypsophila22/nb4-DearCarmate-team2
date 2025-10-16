import prisma from '../../lib/prisma.js';

export const deleteContractsRepository = async (contractId: number) => {
  // 계약 삭제
  await prisma.contracts.delete({
    where: { id: contractId },
  });
};
