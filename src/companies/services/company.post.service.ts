// src/companies/services/company.post.service.ts
import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const createCompanyService = async (
  companyName: string,
  companyCode: string,
) => {
  // 1. (입력 검증은 Zod가 이미 처리)

  // 2. 중복 코드 검증 (DB 기반 비즈니스 로직)
  const existing = await companyRepository.findByCode(companyCode);
  if (existing) {
    throw createHttpError(400, '이미 존재하는 회사 코드입니다.');
  }

  // 3. 회사 생성
  const newCompany = await companyRepository.create(
    companyName.trim(),
    companyCode.trim(),
  );
  return newCompany;
};
