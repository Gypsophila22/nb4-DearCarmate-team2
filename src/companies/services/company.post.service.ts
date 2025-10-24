// src/companies/services/company.post.service.ts
import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const createCompanyService = async (
  companyName: string,
  companyCode: string,
) => {
  const existing = await companyRepository.findByCode(companyCode);
  if (existing) {
    throw createHttpError(400, '이미 존재하는 회사 코드입니다.');
  }

  const newCompany = await companyRepository.create(
    companyName.trim(),
    companyCode.trim(),
  );
  return newCompany;
};
