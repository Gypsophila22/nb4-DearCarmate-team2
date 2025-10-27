import { customerRepository } from '../repositories/customer.repository.js';
import createError from 'http-errors';
import {
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

export const customerGetByIdService = {
  getCustomerById: async (id: number, companyId: number) => {
    const customer = await customerRepository.findById(id, companyId);

    if (!customer) {
      throw createError(404, '고객을 찾을 수 없습니다.');
    }

    const contractCount =
      await customerRepository.getContractCountForCustomer(id);

    return {
      ...customer,
      contractCount,
      ageGroup: mapAgeGroupToKorean(customer.ageGroup),
      region: mapRegionToKorean(customer.region),
    };
  },
};
