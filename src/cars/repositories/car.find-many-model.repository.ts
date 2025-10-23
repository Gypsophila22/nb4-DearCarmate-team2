import prisma from '../../lib/prisma.js';

export type UniqueModel = { manufacturer: string; model: string };

/**
 * 여러 차량 모델 조회 Repository
 * @param uniqueModels - [{ manufacturer, model }]
 */

export const carFindManyModelRepository = (uniqueModels: UniqueModel[]) => {
  return prisma.carModel.findMany({
    where: {
      OR: uniqueModels.map((r) => ({
        manufacturer: r.manufacturer,
        model: r.model,
      })),
    },
  });
};
