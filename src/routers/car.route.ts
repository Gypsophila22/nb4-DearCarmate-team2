import express from "express";
import passport from "passport";

//import를 index 사용해서 캡슐화 진행해주세요
import { createCarsController } from "../cars/controllers/createCar.js";
import { deleteCarController } from "../cars/controllers/deleteCarsController.js";
import { getCarByIdController } from "../cars/controllers/getCarByIdController.js";
import { getCarModelsController } from "../cars/controllers/getCarModelsController.js";
import { getCarsListController } from "../cars/controllers/getCarsListController.js";
import { updateCarsController } from "../cars/controllers/updateCarsController.js";

const router = express.Router();

//passport를 직접 받아서 쓰지 마시고, user.route.ts의 사례처럼 passports를 받아와서 넣어주세요

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
