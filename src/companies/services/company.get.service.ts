import { companyRepository } from "../repositories/company.repository.js";

export const getCompanyService = async (
  page: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string
) => {
  const { companies, totalItemCount } = await companyRepository.findAll(
    page,
    pageSize,
    searchBy,
    keyword
  );

  const totalPages = Math.ceil(totalItemCount / pageSize);

  // ⚙️ 명세서에 맞춰 반환 데이터 포맷
  const formattedData = companies.map((company) => ({
    id: company.id,
    companyName: company.companyName,
    companyCode: company.companyCode,
    userCount: company.user.length,
  }));

  return {
    currentPage: page,
    totalPages,
    totalItemCount,
    data: formattedData,
  };
};
