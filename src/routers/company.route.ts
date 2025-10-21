import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import passport from 'passport';
import companyController from '../companies/controllers/index.js';
import { checkAdmin } from '../middlewares/checkAdmin.js';

const router = express.Router();

//console.log("companyController 확인:", companyController);

// 회사 등록 (POST /companies)1
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  companyController.createCompany,
);

// 회사 목록 조회 (GET /companies)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  companyController.getCompany,
);

// 회사별 유저 조회 (GET /companies/users)
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  companyController.getCompanyUsers,
);

// 회사 수정 (PATCH /companies/:companyId)
router.patch(
  '/:companyId',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  companyController.updateCompany,
);

// 회사 삭제 (DELETE /companies/:companyId)
router.delete(
  '/:companyId',
  passport.authenticate('jwt', { session: false }),
  checkAdmin,
  companyController.deleteCompany,
);

export default router;
