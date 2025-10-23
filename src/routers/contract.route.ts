import express from 'express';

import { contractSchema } from '../contracts/contract.schema.js';
import { contractController } from '../contracts/contract.controller.js';
import passports from '../lib/passport/index.js';

const contractRouter = express.Router();

contractRouter
  .route('/')
  .post(passports.jwtAuth, contractSchema.create, contractController.create) // 계약 등록
  .get(passports.jwtAuth, contractController.list); // 계약 목록 조회

contractRouter
  .route('/:contractId')
  .patch(passports.jwtAuth, contractSchema.update, contractController.update) // 계약 수정 (계약서 수정 포함)
  .delete(passports.jwtAuth, contractSchema.delete, contractController.delete); // 계약 삭제

contractRouter
  .route('/cars')
  .get(passports.jwtAuth, contractController.getCarList); // 계약용 차량 목록 조회
contractRouter
  .route('/customers')
  .get(passports.jwtAuth, contractController.customersList); // 계약용 고객 목록 조회
contractRouter
  .route('/users')
  .get(passports.jwtAuth, contractController.usersList); // 계약용 유저 목록 조회

export default contractRouter;
