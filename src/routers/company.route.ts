// src/companies/routes/company.route.ts
import { Router } from 'express';
import passport from 'passport';
import companyController from '../companies/controllers/index.js';
import { companySchema } from '../companies/schemas/company.schema.js';

const router = Router();

// ✅ 회사 등록
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  companySchema.companyRegister,
  companyController.createCompany,
);

// ✅ 회사 목록 조회
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  companySchema.companyGet,
  companyController.getCompany,
);

// ✅ 회사별 유저 조회
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  companySchema.companyGetUsers,
  companyController.getCompanyUsers,
);

// ✅ 회사 수정
router.patch(
  '/:companyId',
  passport.authenticate('jwt', { session: false }),
  companySchema.companyPatch,
  companyController.patchCompany,
);

// ✅ 회사 삭제
router.delete(
  '/:companyId',
  passport.authenticate('jwt', { session: false }),
  companySchema.companyDeleteParam,
  companyController.deleteCompany,
);

export default router;
