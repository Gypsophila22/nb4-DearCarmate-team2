import { companyRepository } from '../repositories/company.repository.js';

export const getCompanyUsersService = async (
  page: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string,
) => {
  const { users, totalItemCount } = await companyRepository.findCompanyUsers(
    page,
    pageSize,
    searchBy,
    keyword,
  );

  const totalPages = Math.ceil(totalItemCount / pageSize);

  return {
    currentPage: page,
    totalPages,
    totalItemCount,
    data: users,
  };
};
