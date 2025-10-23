import { customerRepository } from '../repositories/index.js';
import type { UpdateCustomerBody } from '../schemas/customers.schema.js';
import createError from 'http-errors';
import { AgeGroup, Region } from '@prisma/client'; // Add Region import
import { DuplicateCustomerError } from '../utils/DuplicateCustomerError.js'; // Add this import

const ageGroupMap: Record<string, AgeGroup> = {
  '10대': AgeGroup.GENERATION_10,
  '20대': AgeGroup.GENERATION_20,
  '30대': AgeGroup.GENERATION_30,
  '40대': AgeGroup.GENERATION_40,
  '50대': AgeGroup.GENERATION_50,
  '60대': AgeGroup.GENERATION_60,
  '70대': AgeGroup.GENERATION_70,
  '80대': AgeGroup.GENERATION_80,
};

// Add regionMap
const regionMap: Record<string, Region> = {
  '서울': Region.서울,
  '경기': Region.경기,
  '인천': Region.인천,
  '강원': Region.강원,
  '충북': Region.충북,
  '충남': Region.충남,
  '세종': Region.세종,
  '대전': Region.대전,
  '전북': Region.전북,
  '전남': Region.전남,
  '광주': Region.광주,
  '경북': Region.경북,
  '경남': Region.경남,
  '대구': Region.대구,
  '울산': Region.울산,
  '부산': Region.부산,
  '제주': Region.제주,
};

export const customerUpdateService = {
  updateCustomer: async (
    id: number,
    data: UpdateCustomerBody,
    companyId: number,
  ) => {
    const transformedData = {
      ...data,
      ageGroup: data.ageGroup ? ageGroupMap[data.ageGroup] : undefined,
      region: data.region ? regionMap[data.region] : undefined, // Add region transformation
    };

    try {
      const updated = await customerRepository.update(id, transformedData, companyId);

      if (updated.count === 0) {
        throw createError(404, '없는 고객이거나 수정할 권한이 없습니다.');
      }

      return customerRepository.findById(id, companyId);
    } catch (error) {
      if (error instanceof DuplicateCustomerError) {
        throw createError(409, error.message); // 409 Conflict
      }
      throw error;
    }
  },
};
