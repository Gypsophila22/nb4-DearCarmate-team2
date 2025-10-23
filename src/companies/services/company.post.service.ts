import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const createCompanyService = async (
  companyName: string,
  companyCode: string,
) => {
  // ✅ 1. 기본 입력값 검증
  if (
    !companyName ||
    !companyCode ||
    typeof companyName !== 'string' ||
    typeof companyCode !== 'string' ||
    !companyName.trim() ||
    !companyCode.trim()
  ) {
    throw createHttpError(400, '잘못된 요청입니다.');
  }

  // ✅ 2. 중복 코드 검증
  const existing = await companyRepository.findByCode(companyCode);
  if (existing) {
    throw createHttpError(400, '이미 존재하는 회사 코드입니다.');
  }

  // ✅ 3. 회사 생성
  const newCompany = await companyRepository.create(
    companyName.trim(),
    companyCode.trim(),
  );
  return newCompany;
};
