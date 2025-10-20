import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';

export const customerRepository = {
  findMany: async (
    companyId: number,
    page: number,
    pageSize: number,
    searchBy?: 'name' | 'email',
    keyword?: string
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
};