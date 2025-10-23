import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const getCompanyService = async (
  page: number,
  pageSize: number,
  searchBy?: string,
  keyword?: string,
) => {
  const validSearchFields = ['companyName', 'companyCode'];

  if (searchBy && !validSearchFields.includes(searchBy)) {
    throw createHttpError(400, '유효하지 않은 검색 기준입니다.');
  }

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
