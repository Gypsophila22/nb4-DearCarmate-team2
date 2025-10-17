<<<<<<< HEAD
import prisma from "../../config/prisma.js";
import type { Prisma } from "../../../generated/prisma/index.js";
=======
import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../../generated/prisma/index.js';
>>>>>>> 340732a (develop 최신화 && users 파트 companyCode, companyName merge 전 임시 변경)

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
