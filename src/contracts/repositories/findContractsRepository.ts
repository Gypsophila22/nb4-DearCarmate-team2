import prisma from '../../lib/prisma.js';

/**
 * 계약 존재 확인 레포지토리
 * @param contractId
 */
export const findContractsRepository = async (contractId: number) => {
  const contract = await prisma.contracts.findUnique({
    where: { id: Number(contractId) },
  });
  if (!contract) {
    throw new Error('존재하지 않는 계약입니다');
  }
};
