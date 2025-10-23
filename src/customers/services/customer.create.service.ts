import { customerRepository } from '../repositories/index.js';
import type { CreateCustomerBody } from '../schemas/customers.schema.js';
import createError from 'http-errors';
import { mapAgeGroupToEnum } from '../utils/customer.mapper.js'; // Import mapAgeGroupToEnum

export const customerCreateService = {
  createCustomer: async (data: CreateCustomerBody, companyId: number) => {
    const transformedData = {
      ...data,
      ageGroup: mapAgeGroupToEnum(data.ageGroup), // Use the centralized mapping function
    };
    try {
      return await customerRepository.create(transformedData, companyId);
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
