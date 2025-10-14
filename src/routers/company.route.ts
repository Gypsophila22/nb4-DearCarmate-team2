import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import passport from "passport";
<<<<<<< HEAD

import postCompany from "../companies/controllers/postCompany.js";
import getCompany from "../companies/controllers/getCompany.js";
import patchCompany from "../companies/controllers/patchCompany.js";
import deleteCompany from "../companies/controllers/deleteCompany.js";
import getCompanyUsers from "../companies/controllers/getCompanyUsers.js";

const router = express.Router();

// 회사 등록
=======
import companyController from "../companies/controllers/index.js";

const router = express.Router();

// 회사 등록 (POST /companies)
>>>>>>> 05e7632 (wip: JWT 인증 및 회사 등록 API 401 오류 원인 수정 진행 중)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postCompany.createCompany
);

<<<<<<< HEAD
// 회사 목록 조회
// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   getCompany.getCompany
// );

// router.get(
//   "/:companyId/users",
//   passport.authenticate("jwt", { session: false }),
//   getCompanyUsers.getCompanyUsers
// );

=======
// 회사 목록 조회 (GET /companies)
router.get(
  "/companies",
  passport.authenticate("jwt", { session: false }),
  companyController.getCompany
);

// 회사별 유저 조회 (GET /companies/:companyId/users)
>>>>>>> 05e7632 (wip: JWT 인증 및 회사 등록 API 401 오류 원인 수정 진행 중)
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

<<<<<<< HEAD
router.get(
  "/:companyId/users",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.warn("테스트용 더미 코드");
    res.json({
      currentPage: 1,
      totalPages: 2,
      totalItemCount: 6,
      data: [
        {
          id: 1,
          name: "string",
          email: "string",
          employeeNumber: "string",
          phoneNumber: "string",
          company: {
            companyName: "string",
          },
        },
      ],
    });
  }
);

// 회사 수정 & 삭제 (체인으로)
router
  .route("/:companyId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    patchCompany.updateCompany
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    deleteCompany.deleteCompany
  );
=======
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
>>>>>>> 05e7632 (wip: JWT 인증 및 회사 등록 API 401 오류 원인 수정 진행 중)

export default router;
