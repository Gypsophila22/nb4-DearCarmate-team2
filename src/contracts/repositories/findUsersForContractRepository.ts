import prisma from '../../lib/prisma.js';

export const findUsersForContractRepository = async (userId: number) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });
  if (!user) {
    throw new Error(`존재하지 않는 유저입니다`);
  }
};
