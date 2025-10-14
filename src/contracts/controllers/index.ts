import { createContractsController } from './createContractsController.js';
import { getContractsListController } from './getContractsListController.js';

const contractController = {
  create: createContractsController,
  getList: getContractsListController,
};

Object.freeze(contractController);

export default contractController;
