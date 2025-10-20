import customerRepository from '../repositories/index.js';

export const customerGetService = {
  getCustomers: async (
    companyId: number,
    page: number,
    pageSize: number,
    searchBy?: 'name' | 'email',
    keyword?: string
  ) => {
    const { customers, totalCustomers } = await customerRepository.findMany(
      companyId,
      page,
      pageSize,
      searchBy,
      keyword
    );

    const totalPages = Math.ceil(totalCustomers / pageSize);

    return {
      data: customers,
      currentPage: page,
      totalPages,
    };
  },
};
