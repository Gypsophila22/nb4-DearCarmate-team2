import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import passport from 'passport';

import postCompany from '../companies/controllers/postCompany.js';
import getCompany from '../companies/controllers/getCompany.js';
import patchCompany from '../companies/controllers/patchCompany.js';
import deleteCompany from '../companies/controllers/deleteCompany.js';
import getCompanyUsers from '../companies/controllers/getCompanyUsers.js';

const router = express.Router();

// 회사 등록
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  postCompany.createCompany,
);

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

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.warn('테스트용 더미 코드');
    res.json({
      currentPage: 1,
      totalPages: 1,
      totalItemCount: 1,
      data: [
        {
          id: 1,
          companyName: 'string',
          companyCode: 'string',
          userCount: 3,
        },
      ],
    });
  },
);

router.get(
  '/:companyId/users',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.warn('테스트용 더미 코드');
    res.json({
      currentPage: 1,
      totalPages: 2,
      totalItemCount: 6,
      data: [
        {
          id: 1,
          name: 'string',
          email: 'string',
          employeeNumber: 'string',
          phoneNumber: 'string',
          company: {
            companyName: 'string',
          },
        },
      ],
    });
  },
);

// 회사 수정 & 삭제 (체인으로)
router
  .route('/:companyId')
  .patch(
    passport.authenticate('jwt', { session: false }),
    patchCompany.updateCompany,
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    deleteCompany.deleteCompany,
  );

export default router;
