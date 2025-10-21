import prisma from "../../lib/prisma.js";

export const findUsersForContractRepository = async (userId: number) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });
  return user;
};
