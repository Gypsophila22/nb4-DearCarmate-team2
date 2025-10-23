import prisma from '../../lib/prisma.js';
import { Prisma } from '@prisma/client';

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
