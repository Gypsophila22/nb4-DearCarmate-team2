// src/companies/routes/company.route.ts
import { Router } from 'express';
import passports from '../lib/passport/index.js';
import companyController from '../companies/controllers/index.js';
import { companySchema } from '../companies/schemas/company.schema.js';

const router = Router();

// ✅ 회사 등록
router.post(
  '/',
  passports.jwtAuth,
  companySchema.companyRegister,
  companyController.createCompany,
);

// ✅ 회사 목록 조회
router.get(
  '/',
  passports.jwtAuth,
  companySchema.companyGet,
  companyController.getCompany,
);

// ✅ 회사별 유저 조회
router.get(
  '/users',
  passports.jwtAuth,
  companySchema.companyGetUsers,
  companyController.getCompanyUsers,
);

// ✅ 회사 수정
router.patch(
  '/:companyId',
  passports.jwtAuth,
  companySchema.companyPatch,
  companyController.patchCompany,
);

// ✅ 회사 삭제
router.delete(
  '/:companyId',
  passports.jwtAuth,
  companySchema.companyDeleteParam,
  companyController.deleteCompany,
);

export default router;
