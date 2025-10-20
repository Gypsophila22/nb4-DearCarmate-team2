import customerRepository from '../repositories/index.js';
import createError from 'http-errors';
import { mapAgeGroupToKorean } from '../utils/customer.mapper.js';

export const customerGetByIdService = {
  getCustomerById: async (id: number, companyId: number) => {
    const customer = await customerRepository.findById(id, companyId);

    if (!customer) {
      throw createError(404, '고객을 찾을 수 없습니다.');
    }

    return {
      ...customer,
      ageGroup: mapAgeGroupToKorean(customer.ageGroup),
    };
  },
};
