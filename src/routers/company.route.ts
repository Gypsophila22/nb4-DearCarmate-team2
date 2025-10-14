import express from "express";
import passport from "passport";
import companyController from "../companies/controllers/index.js";

const router = express.Router();

// 회사 등록 (POST /companies)
router.post(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  companyController.createCompany
);

// 회사 목록 조회 (GET /companies)
router.get(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompany
);

// 회사별 유저 조회 (GET /companies/:companyId/users)
router.get(
  "/companies/:companyId/users",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompanyUsers
);

// 회사 수정 (PATCH /companies/:companyId)
router.patch(
  "/companies/:companyId",
  passport.authenticate("jwt", { session: false }),
  companyController.updateCompany
);

// 회사 삭제 (DELETE /companies/:companyId)
router.delete(
  "/companies/:companyId",
  passport.authenticate("jwt", { session: false }),
  companyController.deleteCompany
);

export default router;
