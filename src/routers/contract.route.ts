import express from 'express';

import contractController from '../contracts/controllers/index.js';
import contractDto from '../contracts/dtos/index.js';
import passports from '../lib/passport/index.js';
import { validationMiddleware } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(passports.jwtAuth, contractController.create) // 계약 등록
  .get(passports.jwtAuth, contractController.getList); // 계약 목록 조회

router
  .route('/:contractId')
  .patch(passports.jwtAuth, contractController.update) // 계약 수정 (계약서 수정 포함)
  .delete(
    passports.jwtAuth,
    validationMiddleware(contractDto.delete, 'params'),
    contractController.delete,
  ); // 계약 삭제

// router.route('/cars').get(passports.jwtAuth,) // 계약용 차량 목록 조회
// router.route('/customers').get(passports.jwtAuth,)// 계약용 고객 목록 조회
// router.route('/users').get(passports.jwtAuth,) // 계약용 유저 목록 조회

export default router;
