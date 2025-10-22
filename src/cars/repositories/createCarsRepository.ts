import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';

/**
 * 차량 생성 Repository
 */
export const createCarsRepository = {
  create: (data: Prisma.CarsCreateInput) =>
    prisma.cars.create({
      data,
      include: { carModel: true },
    }),
};
