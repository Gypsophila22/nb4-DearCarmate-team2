import { createContractsService } from './createContractsService.js';
import { getContractsListService } from './getContractsListService.js';
import { updateContractsService } from './updateContractsService.js';

type ContractService = {
  create: typeof createContractsService;
  getList: typeof getContractsListService;
  update: typeof updateContractsService;
};

const contractService: ContractService = {
  create: createContractsService,
  update: updateContractsService,
  getList: getContractsListService,
};

Object.freeze(contractService);

export default contractService;
