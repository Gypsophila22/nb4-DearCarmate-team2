import { contractFindExistingRepository } from './contract.find-existing.repository.js';
import { createContractsRepository } from './createContractsRepository.js';
import { deleteContractsRepository } from './deleteContractsRepository.js';
import { findCarsForContractRepository } from './findCarsAndStatusContractRepository.js';
import { findContractsRepository } from './findContractsRepository.js';
import { findCustomersForContractRepository } from './findCustomersForContractRepository.js';
import { findUsersForContractRepository } from './findUsersForContractRepository.js';
import { getCarsListForContractRepository } from './getCarsListForContractRepository.js';
import { getContractsListRepository } from './getContractsListRepository.js';
import { getCustomersListForContractRepository } from './getCustomersListForContractRepository.js';
import { getUsersListForContractRepository } from './getUsersListForContractRepository.js';
import { updateContractsRepository } from './updateContractsRepository.js';

const contractRepository = {
  create: createContractsRepository,
  getList: getContractsListRepository,
  update: updateContractsRepository,
  delete: deleteContractsRepository,
  findContract: findContractsRepository,
  findCar: findCarsForContractRepository,
  findCustomer: findCustomersForContractRepository,
  findUser: findUsersForContractRepository,
  getCarsListForContract: getCarsListForContractRepository,
  getUsersListForContract: getUsersListForContractRepository,
  getCustomersListForContract: getCustomersListForContractRepository,
  contractFindExisting: contractFindExistingRepository,
};

Object.freeze(contractRepository);

export default contractRepository;
