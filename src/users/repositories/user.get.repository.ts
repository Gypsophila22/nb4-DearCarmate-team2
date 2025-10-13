import prisma from '../../config/prisma.js';

export const userGetRepository = {
  findSelectedById(id: number) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        employeeNumber: true,
        phoneNumber: true,
        imgUrl: true,
        isAdmin: true,
        company: { select: { code: true } },
      },
    });
  },
};
