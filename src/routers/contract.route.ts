import express from 'express';

import contractController from '../contracts/controllers/index.js';
import passports from '../lib/passport/index.js';

const router = express.Router();

router
  .route('/')
  .get(passports.jwtAuth, contractController.getList) // 계약 목록 조회
  .post(passports.jwtAuth, contractController.create); // 계약 등록

export default router;
