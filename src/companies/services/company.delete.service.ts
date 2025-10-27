import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const deleteCompanyService = async (companyId: number) => {
  // ✅ 1. 존재 여부 확인
  const exist = await companyRepository.findById(companyId);
  if (!exist) {
    throw createHttpError(404, '존재하지 않는 회사입니다.');
  }

  // ✅ 2. 삭제
  const result = await companyRepository.deleteCompanyById(companyId);
  return result;
};
