import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';

import type {
  TransformedCreateCustomerData,
  TransformedUpdateCustomerData,
  TransformedCustomerCsvRow,
} from '../schemas/customer.schema.js';

class CustomerRepository {
  findMany = async (
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
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      prisma.customers.count({
        where,
      }),
    ]);

    return { customers, totalCustomers };
  };

  findById = async (id: number, companyId: number) => {
    return prisma.customers.findFirst({
      where: {
        id,
        companyId,
      },
    });
  };

  create = async (data: TransformedCreateCustomerData, companyId: number) => {
    return await prisma.customers.create({
      data: {
        ...data,
        company: {
          connect: { id: companyId },
        },
      },
    });
  };

  update = async (
    id: number,
    data: TransformedUpdateCustomerData,
    companyId: number,
  ) => {
    return await prisma.customers.update({
      where: {
        id,
        companyId,
      },
      data,
    });
  };

  findByEmail = async (email: string, tx?: Prisma.TransactionClient) => {
    return (tx || prisma).customers.findFirst({ where: { email } });
  };

  findByPhoneNumber = async (
    phoneNumber: string,
    tx?: Prisma.TransactionClient,
  ) => {
    return (tx || prisma).customers.findFirst({ where: { phoneNumber } });
  };

  updateFromCsv = async (
    id: number,
    data: TransformedCustomerCsvRow,
    tx?: Prisma.TransactionClient,
  ) => {
    return (tx || prisma).customers.update({
      where: { id: id },
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
  };

  createFromCsv = async (
    data: TransformedCustomerCsvRow,
    companyId: number,
    tx?: Prisma.TransactionClient,
  ) => {
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
  };

  delete = async (id: number, companyId: number) => {
    return prisma.customers.deleteMany({
      where: {
        id,
        companyId,
      },
    });
  };
}

export const customerRepository = new CustomerRepository();
