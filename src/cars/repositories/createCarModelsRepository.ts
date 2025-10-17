import { CarType } from '@prisma/client';
<<<<<<< HEAD
import prisma from '../../config/prisma.js';
=======
import prisma from '../../lib/prisma.js';
>>>>>>> 340732a (develop 최신화 && users 파트 companyCode, companyName merge 전 임시 변경)

/**
 * 차량 모델 생성 Repository
 */
export const createCarsModelRepository = {
  create: (data: { manufacturer: string; model: string; type: CarType }) =>
    prisma.carModel.create({
      data,
    }),
};
