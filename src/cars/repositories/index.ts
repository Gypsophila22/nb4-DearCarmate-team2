<<<<<<< HEAD
import { carCreateManyRepository } from "./car.create-many.repository.js";
import { createCarsModelRepository } from "./createCarModelsRepository.js";
import { findCarModelRepository } from "./findCarModelRepository.js";
import { getCarsListRepository } from "./getList.js";
=======
import { carCreateManyRepository } from './car.create-many.repository.js';
import { createCarsModelRepository } from './createCarModelsRepository.js';
import { findCarModelRepository } from './findCarModelRepository.js';
import { getCarsListRepository } from './getList.js';
>>>>>>> develop

const carRepository = {
  getList: getCarsListRepository,
  createMany: carCreateManyRepository,
  findModel: findCarModelRepository,
  createModel: createCarsModelRepository,
};

Object.freeze(carRepository);

export default carRepository;
