import { createContractsRepository } from './createContractsRepository.js';
import { getContractsListRepository } from './getContractsListRepository.js';
import { updateContractsRepository } from './updateContractsRepository.js';

const contractRepository = {
  create: createContractsRepository,
  getList: getContractsListRepository,
  update: updateContractsRepository,
};

Object.freeze(contractRepository);

export default contractRepository;
