import { carRepository } from '../repositories/car.repository.js';

import type { CarFilter, GetList } from '../repositories/types/car.types.js';

/**
 * 차량 목록 조회 Service
 */

export const carGetListService = async ({
  page,
  pageSize,
  searchBy,
  keyword,
  status,
}: GetList) => {
  const filter: CarFilter = {
    search: {},
    page: (page - 1) * pageSize,
    pageSize,
  };
  if (status) filter.search.status = status;
  if (keyword && searchBy) {
    if (searchBy === 'carNumber') {
      filter.search.carNumber = {
        contains: keyword,
        mode: 'insensitive',
      };
    }
    if (searchBy === 'model') {
      filter.search.carModel = {
        model: {
          contains: keyword,
          mode: 'insensitive',
        },
      };
    }
  }
  const result = await carRepository.findList(filter);
  return result;
};
