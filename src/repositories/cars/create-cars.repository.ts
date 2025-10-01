import prisma from '../../config/prisma.js';

/**
 * 차량 생성 Repository
 */
export const createCarRepository = {
  create: (data: any) =>
    prisma.cars.create({
      data,
      include: { carModel: true },
    }),
};
