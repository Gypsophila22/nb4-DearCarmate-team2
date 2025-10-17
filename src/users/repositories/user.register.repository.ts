import prisma from '../../lib/prisma.js';

export const userRegisterRepository = {
  findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  },

  createUser(data: {
    name: string;
    email: string;
    employeeNumber: string;
    phoneNumber: string;
    password: string;
    companyCode: string;
  }) {
    return prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        employeeNumber: data.employeeNumber,
        phoneNumber: data.phoneNumber,
        password: data.password,
        company: { connect: { companyCode: data.companyCode } },
<<<<<<< HEAD
      },
      include: { company: { select: { companyName: true, companyCode: true } } },
=======
      },
      select: {
        id: true,
        name: true,
        email: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        company: {
          select: { companyCode: true },
        },
      },
>>>>>>> 821a78b (refactor: 리뷰 반영, 스키마 수정 (#38))
    });
  },

  findByCode(companyCode: string) {
    return prisma.companies.findUnique({ where: { companyCode } });
  },
};
