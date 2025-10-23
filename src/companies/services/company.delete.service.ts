import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

// 🔍 Prisma 오류 감지용 타입가드
function isPrismaKnownError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as Record<string, unknown>).code === 'string'
  );
}

export const deleteCompanyService = async (companyId: number) => {
  try {
    // ✅ 존재 여부 확인
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw createHttpError(404, '존재하지 않는 회사입니다.');
    }

    // ✅ 실제 삭제 실행
    const result = await companyRepository.deleteCompanyById(companyId);
    return result; // { message: '회사 삭제 성공' }
  } catch (err: unknown) {
    // ✅ 타입가드로 안전하게 검사 (단언 X)
    if (isPrismaKnownError(err) && err.code === 'P2025') {
      throw createHttpError(404, '존재하지 않는 회사입니다.');
    }
    throw err;
  }
};
