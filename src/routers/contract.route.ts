import express from 'express';

import contractController from '../contracts/controllers/index.js';
import passports from '../lib/passport/index.js';
import { protect } from '../middlewares/auth.js';
import { patchContract } from '../contracts/controllers/patchContract.controller.js';

const router = express.Router();

router
  .route('/')
  .get(passports.jwtAuth, contractController.getList) // 계약 목록 조회
  .post(passports.jwtAuth, contractController.create); // 계약 등록

// TODO: 실제 수정 로직은 보경님 구현 예정
router.patch('/:id', protect, patchContract);
export default router;
