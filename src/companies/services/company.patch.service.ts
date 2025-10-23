import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const patchCompanyService = async (
  companyId: number,
  companyName: string,
  companyCode: string,
) => {
  // 1. 입력값 검증 (강화)
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

  // 2. 회사 존재 여부 확인 (레포지토리 내부에서도 처리 가능)
  const updatedCompany = await companyRepository.updateCompanyById(companyId, {
    companyName: companyName.trim(),
    companyCode: companyCode.trim(),
  });

  return updatedCompany;
};
