import { companyRepository } from '../repositories/company.repository.js';

export const getCompanyService = async (
  page: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string,
) => {
  // ✅ 실제 로직은 여전히 서비스가 책임
  const { companies, totalItemCount } = await companyRepository.findAll(
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
    data: companies.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      companyCode: c.companyCode,
      userCount: c._count.user,
    })),
  };
};
