import prisma from '../../lib/prisma.js';
import type { Prisma } from '../../../generated/prisma/index.js';
<<<<<<< HEAD

=======
>>>>>>> 9c9a97d (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

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
