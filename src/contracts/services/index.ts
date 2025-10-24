import { createContractsService } from './createContractsService.js';
import { deleteContractsService } from './deleteContractsService.js';
import { getCarsListForContractService } from './getCarsListForContractService.js';
import { getContractsListService } from './getContractsListService.js';
import { getCustomersListForContractService } from './getCustomersListForContractService.js';
import { getUsersListForContractService } from './getUsersListForContractService.js';
import { updateContractsService } from './updateContractsService.js';

const contractService = {
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
