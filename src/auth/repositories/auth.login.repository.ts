import prisma from '../../lib/prisma.js';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        password: true,
        company: {
          select: { companyCode: true },
        },
      },
    });
  },
};
