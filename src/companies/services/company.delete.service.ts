import { companyRepository } from "../repositories/company.repository.js";
import createHttpError from "http-errors";

export const deleteCompanyService = async (companyId: number) => {
  // 1️⃣ 존재 여부 확인
  const exist = await companyRepository.findById?.(companyId);

  try {
    const result = await companyRepository.deleteCompanyById(companyId);
    return result; // { message: '회사 삭제 성공' }
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma: Record not found
      throw createHttpError(404, "존재하지 않는 회사입니다");
    }
    throw error;
  }
};
