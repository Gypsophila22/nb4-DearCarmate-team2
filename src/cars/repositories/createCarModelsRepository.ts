<<<<<<< HEAD
import prisma from '../../lib/prisma.js';

=======
import { CarType } from '@prisma/client';
import prisma from '../../lib/prisma.js';
>>>>>>> 9c9a97d (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

/**
 * 차량 모델 생성 Repository
 */
export const createCarsModelRepository = {
  create: (data: { manufacturer: string; model: string; type: CarType }) =>
    prisma.carModel.create({
      data,
    }),
};
