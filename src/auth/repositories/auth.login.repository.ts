import prisma from '../../config/prisma.js';

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
      include: { company: { select: { companyCode: true } } },
    });
  },
};
