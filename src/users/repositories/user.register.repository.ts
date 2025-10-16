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
      },
      include: { company: { select: { companyName: true, companyCode: true } } },
    });
  },
};
