import { z } from 'zod';

import { getCarsListRepository } from '../../repositories/cars/getCarsListRepository.js';

import type { GetCarsListRequestDto } from '../../dtos/cars/getCarsListRequestDto.js';

/**
 * 차량 목록 조회 Service
 */
type CarSearchFilter = {
  status?: 'possession' | 'contractProceeding' | 'contractCompleted';
  carNumber?: { contains: string; mode: 'insensitive' };
  carModel?: {
    model?: { contains: string; mode: 'insensitive' };
  };
};

export type CarFilter = {
  search: CarSearchFilter; // 검색 조건
  page: number; // 현재 페이지 번호
  pageSize: number; // 페이지당 아이템 수
};

export const getCarsListService = async (
  data: z.infer<typeof GetCarsListRequestDto>,
) => {
  const filter: CarFilter = {
    search: {},
    page: (data.page - 1) * data.pageSize,
    pageSize: data.pageSize,
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
  return getCarsListRepository.findCars(filter);
};
