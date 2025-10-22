import { customerRepository } from '../repositories/index.js';
import type { UpdateCustomerBody } from '../schemas/customers.schema.js';
import createError from 'http-errors';
import { AgeGroup } from '@prisma/client';

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

export const customerUpdateService = {
  updateCustomer: async (
    id: number,
    data: UpdateCustomerBody,
    companyId: number,
  ) => {
    const transformedData = {
      ...data,
      ageGroup: data.ageGroup ? ageGroupMap[data.ageGroup] : undefined,
    };

    const updated = await customerRepository.update(id, transformedData, companyId);

    if (updated.count === 0) {
      throw createError(404, '없는 고객이거나 수정할 권한이 없습니다.');
    }

    return customerRepository.findById(id, companyId);
  },
};
