import { customerRepository } from '../repositories/index.js';
import type { TransformedUpdateCustomerBody } from '../schemas/customers.schema.js';
import createError from 'http-errors';
import { mapAgeGroupToEnum, mapRegionToEnum } from '../utils/customer.mapper.js'; // Import mapping functions

export const customerUpdateService = {
  updateCustomer: async (
    id: number,
    data: TransformedUpdateCustomerBody,
    companyId: number,
  ) => {
    const transformedData = {
      ...data,
      ageGroup: mapAgeGroupToEnum(data.ageGroup), // Use centralized mapping function
      region: mapRegionToEnum(data.region), // Use centralized mapping function
    };
    try {
      const result = await customerRepository.update(id, transformedData, companyId);
      return result;
    } catch (error) {
      if (error instanceof createError.HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw createError(409, error.message); // Use http-errors for duplicate errors
      }
      throw error;
    }
  },
};

