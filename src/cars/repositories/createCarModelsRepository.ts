import prisma from '../../lib/prisma.js';
import { CarType, Prisma } from '@prisma/client';

/**
 * 차량 모델 생성 Repository
 */
export const createCarsModelRepository = {
  create: (data: { manufacturer: string; model: string; type: CarType }) =>
    prisma.carModel.create({
      data,
    }),
};

export const createCarsModelTxRepository = {
  create: (
    tx: Prisma.TransactionClient,
    data: { manufacturer: string; model: string; type: CarType },
  ) => tx.carModel.create({ data }),
  createMany: (
    tx: Prisma.TransactionClient,
    data: { manufacturer: string; model: string; type: CarType }[],
  ) => tx.carModel.createMany({ data, skipDuplicates: true }),
};
