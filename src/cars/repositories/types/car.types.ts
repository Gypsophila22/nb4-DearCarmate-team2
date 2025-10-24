import type { CarStatus } from '@prisma/client';

export interface UpdateCarData {
  carNumber?: string;
  manufacturingYear?: number;
  mileage?: number;
  price?: number;
  accidentCount?: number;
  explanation?: string;
  accidentDetails?: string;
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
