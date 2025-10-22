import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.ts';
import type {
  CreateCustomerBody,
  UpdateCustomerBody,
  CustomerCsvRow,
} from '../schemas/customers.schema.js';

export const customerRepository = {
  findMany: async (
    companyId: number,
    page: number,
    pageSize: number,
    searchBy?: 'name' | 'email',
    keyword?: string,
  ) => {
    const where: Prisma.CustomersWhereInput = {
      companyId,
    };

    if (searchBy && keyword) {
      if (searchBy === 'name') {
        where.name = {
          contains: keyword,
        };
      } else if (searchBy === 'email') {
        where.email = {
          contains: keyword,
        };
      }
    }

    const skip = (page - 1) * pageSize;

    const [customers, totalCustomers] = await Promise.all([
      prisma.customers.findMany({
        where,
        take: pageSize,
        skip: skip,
      }),
      prisma.customers.count({
        where,
      }),
    ]);

    return { customers, totalCustomers };
  },

  findById: async (id: number, companyId: number) => {
    return prisma.customers.findFirst({
      where: {
        id,
        companyId,
      },
    });
  },

  create: async (data: CreateCustomerBody, companyId: number) => {
    return prisma.customers.create({
      data: {
        ...data,
        company: {
          connect: { id: companyId },
        },
      },
    });
  },

  update: async (id: number, data: UpdateCustomerBody, companyId: number) => {
    return prisma.customers.updateMany({
      where: {
        id,
        companyId,
      },
      data,
    });
  },

  findByEmail: async (email: string, tx?: Prisma.TransactionClient) => {
    return (tx || prisma).customers.findUnique({ where: { email } });
  },

  findByPhoneNumber: async (
    phoneNumber: string,
    tx?: Prisma.TransactionClient,
  ) => {
    return (tx || prisma).customers.findUnique({ where: { phoneNumber } });
  },

  createFromCsv: async (
    data: CustomerCsvRow,
    companyId: number,
    tx?: Prisma.TransactionClient,
  ) => {
    return (tx || prisma).customers.create({
      data: {
        name: data.고객명,
        gender: data.성별,
        phoneNumber: data.연락처,
        ageGroup: data.연령대,
        email: data.이메일,
        memo: data.메모,
        company: {
          connect: { id: companyId },
        },
      },
    });
  },

  delete: async (id: number, companyId: number) => {
    return prisma.customers.deleteMany({
      where: {
        id,
        companyId,
      },
    });
  },
};
