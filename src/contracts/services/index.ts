import { createContractsService } from './createContractsService.js';
import { getContractsListService } from './getContractsListService.js';

type ContractService = {
  create: typeof createContractsService;
  getContractsList: typeof getContractsListService;
};

const contractService: ContractService = {
  create: createContractsService,
  getContractsList: getContractsListService,
};

Object.freeze(contractService);

export default contractService;
