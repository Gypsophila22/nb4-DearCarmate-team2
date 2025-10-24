import { customerRepository } from '../repositories/customer.repository.js';
import type {
  CreateCustomerBody,
  TransformedCreateCustomerData,
} from '../schemas/customer.schema.js';

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
    const result = await customerRepository.create(transformedData, companyId);
    return {
      ...result,
      ageGroup: mapAgeGroupToKorean(result.ageGroup),
      region: mapRegionToKorean(result.region),
    };
  },
};
