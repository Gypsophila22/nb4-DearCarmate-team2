import { companyRepository } from "../repositories/company.repository.js";
import createHttpError from "http-errors";

export const patchCompanyService = async (
  companyId: number,
  companyName: string,
  companyCode: string
) => {
  if (!companyName || !companyCode) {
    throw createHttpError(400, "잘못된 요청입니다");
  }

  const updatedCompany = await companyRepository.updateCompanyById(companyId, {
    companyName,
    companyCode,
  });

  return updatedCompany;
};
