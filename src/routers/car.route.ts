import express from 'express';
import passports from '../lib/passport/index.js';
import { carController } from '../cars/car.controller.js';
import { uploadCsvMiddleware } from '../cars/upload-csv.middleware.js';

const router = express.Router();

router
  .route('/')
  .post(passports.jwtAuth, carController.create) // 차량 등록
  .get(passports.jwtAuth, getCarsListController); // 차량 목록 조회

router.route('/models').get(
  passports.jwtAuth,
  getCarModelsController, // 차량 모델 목록 조회
);

router
  .route('/upload')
  .post(passports.jwtAuth, uploadCsvMiddleware, carController.uploadCsv);

router
  .route('/:carId')
  .get(passports.jwtAuth, getCarByIdController) // 차량 상세 정보 조회
  .patch(passports.jwtAuth, updateCarsController) // 차량 수정
  .delete(
    passports.jwtAuth,
    deleteCarController, // 차량 삭제
  );

export default router;
