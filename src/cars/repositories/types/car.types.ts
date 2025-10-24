import type { CarStatus } from '@prisma/client';

export interface CreateCar {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation: string;
  accidentDetails: string;
  status: CarStatus;
}

export interface BaseCarUpdate {
  carNumber?: string;
  manufacturingYear?: number;
  mileage?: number;
  price?: number;
  accidentCount?: number;
  explanation?: string;
  accidentDetails?: string;
}

// 서비스 단에서 제조사, 차량 이름 추가
export interface UpdateCar extends BaseCarUpdate {
  manufacturer?: string;
  model?: string;
}

// 리포지토리 단에서는 status 포함
export interface UpdateCarDataForRepository extends BaseCarUpdate {
  status?: CarStatus;
}

export interface UniqueModel {
  manufacturer: string;
  model: string;
}

export interface CarSearchFilter {
  status?: CarStatus;
  carNumber?: { contains: string; mode: 'insensitive' }; // 대소문자 구분 없이
  carModel?: {
    model?: { contains: string; mode: 'insensitive' }; // 대소문자 구분 없이
  };
}

export interface CarFilter {
  search: CarSearchFilter; // 검색 조건
  page: number; // 현재 페이지 번호
  pageSize: number; // 페이지당 아이템 수
}

export interface GetList {
  page: number;
  pageSize: number;
  searchBy?: 'carNumber' | 'model';
  keyword?: string;
  status?: CarStatus;
}
