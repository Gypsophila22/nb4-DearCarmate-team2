import { customerRepository } from '../repositories/customer.repository.js';
import type {
  UpdateCustomerBody,
  TransformedUpdateCustomerData,
} from '../schemas/customer.schema.js';
import createError from 'http-errors';
import {
  toAgeGroupEnum,
  toRegionEnum,
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

export const customerUpdateService = {
  updateCustomer: async (
    id: number,
    data: UpdateCustomerBody,
    companyId: number,
  ) => {
    const transformedData: TransformedUpdateCustomerData = {
      ...data,
      ageGroup: data.ageGroup ? toAgeGroupEnum(data.ageGroup) : undefined,
      region: data.region ? toRegionEnum(data.region) : undefined,
    };
    try {
      const result = await customerRepository.update(
        id,
        transformedData,
        companyId,
      );
      return {
        ...result,
        ageGroup: mapAgeGroupToKorean(result.ageGroup),
        region: mapRegionToKorean(result.region),
      };
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw createError(409, error.message);
      }
      throw error;
    }
  },
};
