import { customerRepository } from '../repositories/index.js';
import {
  mapAgeGroupToKorean,
  mapRegionToKorean,
} from '../utils/customer.mapper.js';

export const customerGetService = {
  getCustomers: async (
    companyId: number,
    page: number,
    pageSize: number,
    searchBy?: 'name' | 'email',
    keyword?: string,
  ) => {
    const { customers, totalCustomers } = await customerRepository.findMany(
      companyId,
      page,
      pageSize,
      searchBy,
      keyword,
    );

    const totalPages = Math.ceil(totalCustomers / pageSize);

    const mappedCustomers = customers.map((customer) => ({
      ...customer,
      ageGroup: mapAgeGroupToKorean(customer.ageGroup),
      region: mapRegionToKorean(customer.region),
    }));

    return {
      data: mappedCustomers,
      currentPage: page,
      totalPages,
    };
  },
};
