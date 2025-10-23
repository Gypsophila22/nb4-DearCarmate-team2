// src/companies/services/company.patch.service.ts
import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const patchCompanyService = async (
  companyId: number,
  data: { companyName: string; companyCode: string },
) => {
  // ✅ 1. 회사 존재 여부 확인
  const exist = await companyRepository.findById(companyId);
  if (!exist) {
    throw createHttpError(404, '존재하지 않는 회사입니다.');
  }

  // ✅ 2. 중복 코드 검증
  const duplicate = await companyRepository.findByCode(data.companyCode);
  if (duplicate && duplicate.id !== companyId) {
    throw createHttpError(400, '이미 존재하는 회사 코드입니다.');
  }

  // ✅ 3. 회사 정보 수정
  const company = await companyRepository.updateCompanyById(companyId, data);
  return company;
};
