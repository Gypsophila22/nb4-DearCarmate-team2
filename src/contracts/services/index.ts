import { createContractsService } from './createContractsService.js';
import { deleteContractsService } from './deleteContractsService.js';
import { getContractsListService } from './getContractsListService.js';
import { updateContractsService } from './updateContractsService.js';

type ContractService = {
  create: typeof createContractsService;
  getList: typeof getContractsListService;
  update: typeof updateContractsService;
  delete: typeof deleteContractsService;
};

const contractService: ContractService = {
  create: createContractsService,
  update: updateContractsService,
  getList: getContractsListService,
  delete: deleteContractsService,
};

Object.freeze(contractService);

export default contractService;
