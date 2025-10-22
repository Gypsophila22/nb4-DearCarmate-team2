import { getCarsListRepository } from './getList.js';

const carRepository = {
  getList: getCarsListRepository,
};

Object.freeze(carRepository);

export default carRepository;
