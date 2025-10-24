import { carRepository } from '../repositories/car.repository.js';

import type { CarFilter, GetList } from '../repositories/types/car.types.js';

/**
 * 차량 목록 조회 Service
 */

export const carGetListService = async (data: GetList) => {
  const page = Number(data.page);
  const pageSize = Number(data.pageSize);

  const filter: CarFilter = {
    search: {},
    page: (page - 1) * pageSize,
    pageSize,
  };
  if (data.status) filter.search.status = data.status;
  if (data.keyword && data.searchBy) {
    if (data.searchBy === 'carNumber') {
      filter.search.carNumber = {
        contains: data.keyword,
        mode: 'insensitive',
      };
    }
    if (data.searchBy === 'model') {
      filter.search.carModel = {
        model: {
          contains: data.keyword,
          mode: 'insensitive',
        },
      };
    }
  }
  const result = await carRepository.findList(filter);
  return result;
};
