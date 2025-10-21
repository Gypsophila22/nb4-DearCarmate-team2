// src/companies/controllers/postCompany.ts
import type { Request, Response, NextFunction } from "express";
import { createCompanyService } from "../services/company.post.service.js";
import createHttpError from "http-errors";

export async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { companyName, companyCode } = req.body;

    if (!companyName || !companyCode) {
      throw createHttpError(400, "잘못된 요청입니다.");
    }

    if (!req.user?.isAdmin) throw createHttpError(401, "관리자 권한이 필요합니다.");

    const company = await createCompanyService(companyName, companyCode);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
}