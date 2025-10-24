import express from 'express';

import { carSchema } from '../cars/schemas/car.schema.js';
import { carController } from '../cars/controllers/car.controller.js';

import { uploadCsvMiddleware } from '../cars/upload-csv.middleware.js';
import passports from '../lib/passport/index.js';

const router = express.Router();

router
  .route('/')
  .post(passports.jwtAuth, carSchema.create, carController.create) // 차량 등록
  .get(passports.jwtAuth, carSchema.getList, carController.getCarsList); // 차량 목록 조회

router.route('/models').get(passports.jwtAuth, carController.getCarModels); // 차량 모델 목록 조회

router
  .route('/upload')
  .post(passports.jwtAuth, uploadCsvMiddleware, carController.uploadCsv);

router
  .route('/:carId')
  .get(passports.jwtAuth, carController.getCarById) // 차량 상세 정보 조회
  .patch(passports.jwtAuth, carSchema.update, carController.updateCars) // 차량 수정
  .delete(passports.jwtAuth, carSchema.delete, carController.deleteCar); // 차량 삭제

export default router;
