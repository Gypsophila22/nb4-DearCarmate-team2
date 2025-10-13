import prisma from '../../config/prisma.js';

import type { CarFilter } from '../../services/cars/getCarsListService.js';

/**
 * 차량 목록 조회 Repository
 */
export const getCarsListRepository = {
  async findCars(filter: CarFilter) {
    const [cars, totalItemCount] = await Promise.all([
      prisma.cars.findMany({
        where: filter.search, // 검색
        skip: filter.page, // 패스할 아이템
        take: filter.pageSize, // 가져올 아이템
        include: { carModel: true }, // 차종 관계 포함
      }),
      prisma.cars.count({
        where: filter.search, // 전체 아이템 수 (totalItemCount)
      }),
    ]);

    return { cars, totalItemCount };
  },
};
