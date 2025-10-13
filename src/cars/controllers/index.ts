import { createCarsController } from "./createCar.js";

const carController = {
  createCar: createCarsController,
};

Object.freeze(carController);

export default carController;
