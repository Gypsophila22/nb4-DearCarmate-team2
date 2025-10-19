import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import passport from "passport";
import companyController from "../companies/controllers/index.js";


const router = express.Router();

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======

>>>>>>> 037d69e (develop 최신화 && users 파트 companyCode, companyName merge 전 임시 변경)
//console.log("companyController 확인:", companyController);


// 회사 등록 (POST /companies)1
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
   companyController.createCompany
);


// 회사 목록 조회 (GET /companies)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
   companyController.getCompany
);


// 회사별 유저 조회 (GET /companies/:companyId/users)
router.get(
  "/:company/users",
  passport.authenticate("jwt", { session: false }),
   companyController.getCompanyUsers
>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)
);


// 회사 수정 (PATCH /companies/:companyId)
router.patch(
  "/:companyId",
  passport.authenticate("jwt", { session: false }),
  companyController.updateCompany
);


// 회사 삭제 (DELETE /companies/:companyId)
router.delete(
  "/:companyId",
  passport.authenticate("jwt", { session: false }),
  companyController.deleteCompany
);

// 회사 삭제 (DELETE /companies/:companyId)
router.delete(
  "/:companyId",
  passport.authenticate("jwt", { session: false }),
  companyController.deleteCompany
)

export default router;



