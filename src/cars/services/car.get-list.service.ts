import { carRepository } from '../car.repository.js';

import type { CarStatus } from '@prisma/client';

/**
 * 차량 목록 조회 Service
 */
type CarSearchFilter = {
  status?: CarStatus;
  carNumber?: { contains: string; mode: 'insensitive' }; // 대소문자 구분 없이
  carModel?: {
    model?: { contains: string; mode: 'insensitive' }; // 대소문자 구분 없이
  };
};

export type CarFilter = {
  search: CarSearchFilter; // 검색 조건
  page: number; // 현재 페이지 번호
  pageSize: number; // 페이지당 아이템 수
};

export const carGetListService = async (data: {
  page: number;
  pageSize: number;
  searchBy?: 'carNumber' | 'model';
  keyword?: string;
  status?: CarStatus;
}) => {
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
