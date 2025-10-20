import customerRepository from '../repositories/index.js';
import type { CreateCustomerBody } from '../schemas/customers.schema.js';

export const customerCreateService = {
  createCustomer: async (data: CreateCustomerBody, companyId: number) => {
    return customerRepository.create(data, companyId);
  },
};
