import { customerRepository } from '../repositories/customer.repository.js';
import { AgeGroup, Gender, Region } from '@prisma/client';

import {
  toAgeGroupEnum,
  toRegionEnum,
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

type UpdateCustomerBody = {
  name?: string;
  gender?: Gender;
  phoneNumber?: string;
  ageGroup?: AgeGroup;
  region?: Region;
  email?: string;
  memo?: string;
};

type TransformedUpdateCustomerData = Omit<
  UpdateCustomerBody,
  'ageGroup' | 'region'
> & {
  ageGroup?: AgeGroup;
  region?: Region;
};

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
  },
};
