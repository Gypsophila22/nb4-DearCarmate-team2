import { carFindManyModelRepository } from './car.find-many-model.repository.js';
import { createManyTx } from './car.create-many.repository.js';
import { findCarModelRepository } from './findCarModelRepository.js';
import { findManyByCarNumbers } from './cat.find-many-by-car-number.repository.js';
import { getCarsListRepository } from './getList.js';
import {
  createCarsModelRepository,
  createCarsModelTxRepository,
} from './createCarModelsRepository.js';

const carRepository = {
  getList: getCarsListRepository,
  createManyTx: createManyTx,
  findModel: findCarModelRepository,
  createModel: createCarsModelRepository,
  findManyModel: carFindManyModelRepository,
  createModelTx: createCarsModelTxRepository,
  findManyByCarNumbers: findManyByCarNumbers,
};

Object.freeze(carRepository);

export default carRepository;
