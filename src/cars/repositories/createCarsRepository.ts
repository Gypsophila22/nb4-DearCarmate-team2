import { CarType } from '@prisma/client';
import prisma from '../../lib/prisma.js';
<<<<<<< HEAD
import type { Prisma } from '../../../generated/prisma/index.js';
<<<<<<< HEAD

=======
>>>>>>> 9c9a97d (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
=======
>>>>>>> 3f31d5b (fix : develop 변경 사항 최신화)

/**
 * 차량 모델 생성 Repository
 */
export const createCarsModelRepository = {
  create: (data: { manufacturer: string; model: string; type: CarType }) =>
    prisma.carModel.create({
      data,
    }),
};