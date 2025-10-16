import { createContractsRepository } from './createContractsRepository.js';
import { deleteContractsRepository } from './deleteContractsRepository.js';
import { findContractsRepository } from './findContractsRepository.js';
import { getContractsListRepository } from './getContractsListRepository.js';
import { updateContractsRepository } from './updateContractsRepository.js';

const contractRepository = {
  find: findContractsRepository,
  create: createContractsRepository,
  getList: getContractsListRepository,
  update: updateContractsRepository,
  delete: deleteContractsRepository,
};

Object.freeze(contractRepository);

export default contractRepository;
