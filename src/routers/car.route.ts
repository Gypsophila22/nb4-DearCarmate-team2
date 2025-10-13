import express from "express";
import passport from "passport";

import { createCarsController } from "../controllers/cars/createCar.js";
import { deleteCarController } from "../controllers/cars/deleteCarsController.js";
import { getCarByIdController } from "../controllers/cars/getCarByIdController.js";
import { getCarModelsController } from "../controllers/cars/getCarModelsController.js";
import { getCarsListController } from "../controllers/cars/getCarsListController.js";
import { updateCarsController } from "../controllers/cars/updateCarsController.js";

const router = express.Router();

router
  .route("/")
  .post(passport.authenticate("jwt", { session: false }), createCarsController) // 차량 등록
  .get(passport.authenticate("jwt", { session: false }), getCarsListController); // 차량 목록 조회

router.route("/models").get(
  passport.authenticate("jwt", { session: false }),
  getCarModelsController // 차량 모델 목록 조회
);

// router.route('/upload').get(); // 차량 데이터 대용량 업로드

router
  .route("/:carId")
  .get(passport.authenticate("jwt", { session: false }), getCarByIdController) // 차량 상세 정보 조회
  .patch(passport.authenticate("jwt", { session: false }), updateCarsController) // 차량 수정
  .delete(
    passport.authenticate("jwt", { session: false }),
    deleteCarController // 차량 삭제
  );

export default router;
