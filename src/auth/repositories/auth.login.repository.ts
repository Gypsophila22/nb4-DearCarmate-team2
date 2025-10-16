<<<<<<< HEAD
import prisma from '../../lib/prisma.js';
=======
import prisma from '../../config/prisma.js';
>>>>>>> develop

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
<<<<<<< HEAD
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
=======
      include: { company: { select: { code: true } } },
>>>>>>> develop
    });
  },
};
