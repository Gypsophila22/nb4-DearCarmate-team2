import { customerRepository } from '../repositories/index.js';
import type { UpdateCustomerBody } from '../schemas/customers.schema.js';
import createError from 'http-errors';

export const customerUpdateService = {
  updateCustomer: async (
    id: number,
    data: UpdateCustomerBody,
    companyId: number,
  ) => {
    const updated = await customerRepository.update(id, data, companyId);

    if (updated.count === 0) {
      throw createError(404, '없는 고객이거나 수정할 권한이 없습니다.');
    }

    return customerRepository.findById(id, companyId);
  },
};
