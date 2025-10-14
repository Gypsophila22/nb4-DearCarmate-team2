import express from "express";
import passport from "passport";
import companyController from "../controllers/companies/index.js";

const router = express.Router();

// 회사 목록 조회
router.get(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompany
);

// 회사 등록
router.post(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  companyController.createCompany
);

// 회사별 유저 조회
router.get(
  "/companies/:companyId/users",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompanyUsers
);

// 회사 수정 & 삭제
router
  .route("/companies/:companyId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    companyController.updateCompany
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    companyController.deleteCompany
  );

export default router;
