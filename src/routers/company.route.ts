import express from 'express';
import passport from 'passport';
import companyController from '../companies/controllers/index.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import CompanySchema from '../companies/schemas/index.js';

const router = express.Router();

// 회사 등록
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateSchema(CompanySchema.createCompanySchema),
  companyController.createCompany,
);

// 회사 목록 조회
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateSchema(CompanySchema.getCompanyQuerySchema),
  companyController.getCompany,
);

// 회사별 유저 조회
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  validateSchema(CompanySchema.getCompanyUsersQuerySchema),
  companyController.getCompanyUsers,
);

// 회사 수정
router.patch(
  '/:companyId',
  passport.authenticate('jwt', { session: false }),
  validateSchema(CompanySchema.patchCompanySchema),
  companyController.patchCompany,
);

// 회사 삭제
router.delete(
  '/:companyId',
  passport.authenticate('jwt', { session: false }),
  validateSchema(CompanySchema.deleteCompanySchema),
  companyController.deleteCompany,
);

export default router;
