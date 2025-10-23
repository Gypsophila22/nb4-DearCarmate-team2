import type { Request, Response, NextFunction } from 'express';
import { patchCompanyService } from '../services/company.patch.service.js';
import { patchCompanySchema } from '../schemas/company.patch.schema.js';

export const patchCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // ✅ Zod로 params + body 검증
    const parsed = patchCompanySchema.parse({
      params: req.params,
      body: req.body,
    });

    const { companyId } = parsed.params;
    const { companyName, companyCode } = parsed.body;

    // 🚀 서비스 호출
    const updatedCompany = await patchCompanyService(
      companyId,
      companyName,
      companyCode,
    );

    res.status(200).json(updatedCompany);
  } catch (err) {
    next(err);
  }
};
