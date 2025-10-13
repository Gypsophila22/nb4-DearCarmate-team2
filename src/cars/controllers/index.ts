import { createCarsController } from "./createCar.js";

//나머지 인덱스를 모두 채워주세요
const carController = {
  createCar: createCarsController,
};

Object.freeze(carController);

export default carController;
