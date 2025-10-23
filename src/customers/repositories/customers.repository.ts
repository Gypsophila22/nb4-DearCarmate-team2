import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';
import { DuplicateCustomerError } from '../utils/DuplicateCustomerError.js';
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
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' },
        ],
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
    try {
      return await prisma.customers.create({
        data: {
          ...data,
          createdAt: new Date(),
          company: {
            connect: { id: companyId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // P2002: Unique constraint violation
        const target = error.meta?.target as string | undefined;
        let message = '중복된 고객 정보입니다.';
        if (target?.includes('phoneNumber')) {
          message = '이미 등록된 연락처입니다.';
        } else if (target?.includes('email')) {
          message = '이미 등록된 이메일입니다.';
        } else if (target?.includes('name') && target?.includes('phoneNumber')) {
          message = '이미 등록된 고객명과 연락처 조합입니다.';
        }
        throw new DuplicateCustomerError(message);
      }
      throw error;
    }
  },

  update: async (id: number, data: UpdateCustomerBody, companyId: number) => {
    try {
      return await prisma.customers.updateMany({
        where: {
          id,
          companyId,
        },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target as string | undefined;
        let message = '중복된 고객 정보입니다.';
        if (target?.includes('phoneNumber')) {
          message = '이미 등록된 연락처입니다.';
        } else if (target?.includes('email')) {
          message = '이미 등록된 이메일입니다.';
        } else if (target?.includes('name') && target?.includes('phoneNumber')) {
          message = '이미 등록된 고객명과 연락처 조합입니다.';
        }
        throw new DuplicateCustomerError(message);
      }
      throw error;
    }
  },

  findByEmail: async (email: string, tx?: Prisma.TransactionClient) => {
    return (tx || prisma).customers.findFirst({ where: { email } });
  },

  findByPhoneNumber: async (
    phoneNumber: string,
    tx?: Prisma.TransactionClient,
  ) => {
    return (tx || prisma).customers.findFirst({ where: { phoneNumber } });
  },

  updateFromCsv: async (
    id: number,
    data: CustomerCsvRow,
    tx?: Prisma.TransactionClient,
  ) => {
    return (tx || prisma).customers.update({
      where: { id },
      data: {
        name: data.name,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        ageGroup: data.ageGroup,
        email: data.email,
        memo: data.memo,
        region: data.region,
      },
    });
  },

  createFromCsv: async (
    data: CustomerCsvRow,
    companyId: number,
    tx?: Prisma.TransactionClient,
  ) => {
    try {
      return await (tx || prisma).customers.create({
        data: {
          name: data.name,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          ageGroup: data.ageGroup,
          email: data.email,
          memo: data.memo,
          region: data.region,
          company: {
            connect: { id: companyId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target as string | undefined;
        let message = '중복된 고객 정보입니다.';
        if (target?.includes('phoneNumber')) {
          message = '이미 등록된 연락처입니다.';
        } else if (target?.includes('email')) {
          message = '이미 등록된 이메일입니다.';
        } else if (target?.includes('name') && target?.includes('phoneNumber')) {
          message = '이미 등록된 고객명과 연락처 조합입니다.';
        }
        throw new DuplicateCustomerError(message);
      }
      throw error;
    }
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
