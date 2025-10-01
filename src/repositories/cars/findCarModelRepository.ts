import prisma from '../../config/prisma.js';

/**
 * 제조사와 모델명으로 carModel 조회
 */
export const findCarModelRepository = {
  findByManufacturerAndModel: (manufacturer: string, model: string) =>
    prisma.carModel.findFirst({
      where: { manufacturer, model },
    }),
};
