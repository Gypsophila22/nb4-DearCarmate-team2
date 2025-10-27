import { customerRepository } from '../repositories/customer.repository.js';
import { AgeGroup, Gender, Region } from '@prisma/client';

import {
  toAgeGroupEnum,
  toRegionEnum,
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

type CreateCustomerBody = {
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup?: AgeGroup;
  region?: Region;
  email?: string;
  memo?: string;
};

type TransformedCreateCustomerData = Omit<
  CreateCustomerBody,
  'ageGroup' | 'region'
> & {
  ageGroup?: AgeGroup;
  region?: Region;
};

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
