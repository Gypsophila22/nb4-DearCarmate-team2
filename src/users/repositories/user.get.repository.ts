import prisma from '../../lib/prisma.js';

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
        imageUrl: true,
        isAdmin: true,
        company: { select: { companyCode: true } },
      },
    });
  },
};
