import prisma from '../../lib/prisma.js';

class UserRepository {
  findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  }

  findByCode(companyCode: string) {
    return prisma.companies.findUnique({ where: { companyCode } });
  }

  findById(id: number) {
    return prisma.users.findUnique({ where: { id } });
  }

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
    });
  }

  updateById(
    id: number,
    data: Partial<{
      employeeNumber: string;
      phoneNumber: string;
      imageUrl: string | null;
      password: string;
    }>,
  ) {
    return prisma.users.update({
      where: { id },
      data,
    });
  }

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
        company: { select: { companyName: true } },
      },
    });
  }

  findByIdWithPassword(id: number) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        isAdmin: true,
      },
    });
  }

  deleteById(id: number) {
    return prisma.users.delete({ where: { id } });
  }

  deleteNonAdminById(id: number) {
    return prisma.users.deleteMany({
      where: { id, isAdmin: false },
    });
  }
}

export const userRepository = new UserRepository();
