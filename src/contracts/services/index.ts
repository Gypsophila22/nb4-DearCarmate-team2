import { createContractsService } from './createContractsService.js';
import { deleteContractsService } from './deleteContractsService.js';
import { getCarsListForContractService } from './getCarsListForContractService.js';
import { getContractsListService } from './getContractsListService.js';
import { getCustomersListForContractService } from './getCustomersListForContractService.js';
import { getUsersListForContractService } from './getUsersListForContractService.js';
import { updateContractsService } from './updateContractsService.js';

type ContractService = {
  create: typeof createContractsService;
  getList: typeof getContractsListService;
  update: typeof updateContractsService;
  delete: typeof deleteContractsService;
  getCarsListForContract: typeof getCarsListForContractService;
  getUsersListForContract: typeof getUsersListForContractService;
  getCustomersListForContract: typeof getCustomersListForContractService;
};

const contractService: ContractService = {
  create: createContractsService,
  update: updateContractsService,
  getList: getContractsListService,
  delete: deleteContractsService,
  getCarsListForContract: getCarsListForContractService,
  getUsersListForContract: getUsersListForContractService,
  getCustomersListForContract: getCustomersListForContractService,
};

Object.freeze(contractService);

export default contractService;
