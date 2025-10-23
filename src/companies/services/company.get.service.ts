import { companyRepository } from '../repositories/company.repository.js';

export const getCompanyService = async (
  page: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string,
) => {
  const { companies, totalItemCount } = await companyRepository.findAll(
    page,
    pageSize,
    searchBy,
    keyword,
  );

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const formattedData = companies.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    companyCode: c.companyCode,
    userCount: c._count.user,
  }));

  return {
    currentPage: page,
    totalPages,
    totalItemCount,
    data: formattedData,
  };
};
