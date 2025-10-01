import { CarType } from '../../../generated/prisma/index.js';
import prisma from '../../config/prisma.js';

/**
 * 차량 모델 생성 Repository
 */
export const createCarsModelRepository = {
  create: (data: { manufacturer: string; model: string; type: CarType }) =>
    prisma.carModel.create({
      data,
    }),
};
