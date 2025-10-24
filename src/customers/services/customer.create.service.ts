import { customerRepository } from '../repositories/customer.repository.js';
import { customerValidation } from '../schemas/customer.schema.js';
import { z } from 'zod';
import { AgeGroup, Region } from '@prisma/client';

import {
  toAgeGroupEnum,
  toRegionEnum,
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

type CreateCustomerBody = z.infer<
  ReturnType<typeof customerValidation.getCreateCustomerSchema>
>;
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
