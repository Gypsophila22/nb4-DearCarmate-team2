import { carUploadCsvController } from './car.upload-csv.controller.js';
import { createCarsController } from './createCar.js';

//나머지 인덱스를 모두 채워주세요
const carController = {
  createCar: createCarsController,
  uploadCsv: carUploadCsvController,
};

Object.freeze(carController);

export default carController;
