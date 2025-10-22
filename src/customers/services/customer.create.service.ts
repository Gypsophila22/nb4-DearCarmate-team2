import { customerRepository } from '../repositories/index.js';
import type { CreateCustomerBody } from '../schemas/customers.schema.js';
import { AgeGroup } from '@prisma/client'; // Import AgeGroup

// Define the mapping for AgeGroup
const ageGroupMap: Record<string, AgeGroup> = {
  '10대': AgeGroup.GENERATION_10,
  '20대': AgeGroup.GENERATION_20,
  '30대': AgeGroup.GENERATION_30,
  '40대': AgeGroup.GENERATION_40,
  '50대': AgeGroup.GENERATION_50,
  '60대': AgeGroup.GENERATION_60,
  '70대': AgeGroup.GENERATION_70,
  '80대': AgeGroup.GENERATION_80,
  [AgeGroup.GENERATION_10]: AgeGroup.GENERATION_10,
  [AgeGroup.GENERATION_20]: AgeGroup.GENERATION_20,
  [AgeGroup.GENERATION_30]: AgeGroup.GENERATION_30,
  [AgeGroup.GENERATION_40]: AgeGroup.GENERATION_40,
  [AgeGroup.GENERATION_50]: AgeGroup.GENERATION_50,
  [AgeGroup.GENERATION_60]: AgeGroup.GENERATION_60,
  [AgeGroup.GENERATION_70]: AgeGroup.GENERATION_70,
  [AgeGroup.GENERATION_80]: AgeGroup.GENERATION_80,
  '10-20': AgeGroup.GENERATION_10,
  '20-30': AgeGroup.GENERATION_20,
  '30-40': AgeGroup.GENERATION_30,
  '40-50': AgeGroup.GENERATION_40,
  '50-60': AgeGroup.GENERATION_50,
  '60-70': AgeGroup.GENERATION_60,
  '70-80': AgeGroup.GENERATION_70,
  '80대 이상': AgeGroup.GENERATION_80,
};

export const customerCreateService = {
  createCustomer: async (data: CreateCustomerBody, companyId: number) => {
    const transformedData = {
      ...data,
      ageGroup: data.ageGroup ? ageGroupMap[data.ageGroup] : null,
    };
    return customerRepository.create(transformedData, companyId);
  },
};
