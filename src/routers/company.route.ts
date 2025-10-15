import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import passport from "passport";
import companyController from "../companies/controllers/index.js";

const router = express.Router();

// 회사 등록 (POST /companies)
  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    postCompany.createCompany
  );

// 회사 목록 조회 (GET /companies)
  router.get(
  "/companies",
    passport.authenticate("jwt", { session: false }),
  companyController.getCompany
  );

// 회사별 유저 조회 (GET /companies/:companyId/users)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.warn("테스트용 더미 코드");
    res.json({
      currentPage: 1,
      totalPages: 1,
      totalItemCount: 1,
      data: [
        {
          id: 1,
          companyName: "string",
          companyCode: "string",
          userCount: 3,
        },
      ],
    });
  }
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
