import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../../generated/prisma/index.js';

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