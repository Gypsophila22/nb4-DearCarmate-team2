import prisma from '../../lib/prisma.js';

/**
 * 계약용 유저 리스트 조회 레포지토리
 * @returns
 */
export const getUsersListForContractRepository = async () => {
  const users = await prisma.users.findMany({
    orderBy: { id: 'asc' },
  });
  return users;
};
