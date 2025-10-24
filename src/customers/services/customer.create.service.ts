import { customerRepository } from '../repositories/index.js';
import type {
  CreateCustomerBody,
  TransformedCreateCustomerData,
} from '../schemas/customer.schema.js';
import createError from 'http-errors';
import {
  toAgeGroupEnum,
  toRegionEnum,
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

export const customerCreateService = {
  createCustomer: async (data: CreateCustomerBody, companyId: number) => {
    const transformedData: TransformedCreateCustomerData = {
      ...data,
      ageGroup: data.ageGroup ? toAgeGroupEnum(data.ageGroup) : undefined,
      region: data.region ? toRegionEnum(data.region) : undefined,
    };
    try {
      const result = await customerRepository.create(
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
