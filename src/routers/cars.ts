import express from 'express';

import { createCarController } from '../controllers/cars/create-cars.controller.js';

const router = express.Router();

router.route('/').post(createCarController); // 차량 등록
// .get(); // 차량 목록 조회

// router
// .route('/:carId')
// .get() // 차량 상세 정보 조회
// .patch() // 차량 수정
// .delete(); // 차량 삭제

// router.route('/upload').get(); // 차량 데이터 대용량 업로드
// router.route('/models').get(); // 차량 모델 목록 조회

export default router;
