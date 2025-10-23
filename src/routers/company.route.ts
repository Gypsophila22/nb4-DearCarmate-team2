import express from 'express';
import { companyController } from '../companies/controllers/index.js';
import { checkAdmin } from '../middlewares/checkAdmin.js';
import { validate } from '../middlewares/validate.js';
import { getCompanyQuerySchema } from '../companies/schemas/company.get.schema.js';
import passports from '../lib/passport/index.js'; // ✅ default import로 변경

const router = express.Router();

// 회사 등록 (POST /companies)
router.post(
  '/',
  passports.jwtAuth,
  checkAdmin,
  companyController.createCompany,
);

// 회사 목록 조회 (GET /companies)
router.get(
  '/',
  passports.jwtAuth,
  validate(getCompanyQuerySchema),
  checkAdmin,
  companyController.getCompany,
);

// 회사별 유저 조회 (GET /companies/users)
router.get(
  '/users',
  passports.jwtAuth,
  checkAdmin,
  companyController.getCompanyUsers,
);

// 회사 수정 (PATCH /companies/:companyId)
router.patch(
  '/:companyId',
  passports.jwtAuth,
  checkAdmin,
  companyController.patchCompany,
);

// 회사 삭제 (DELETE /companies/:companyId)
router.delete(
  '/:companyId',
  passports.jwtAuth,
  checkAdmin,
  companyController.deleteCompany,
);

export default router;
