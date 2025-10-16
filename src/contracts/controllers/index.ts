import { createContractsController } from './createContractsController.js';
import { getContractsListController } from './getContractsListController.js';
import { updateContractsController } from './updateContractsController.js';

const contractController = {
  create: createContractsController,
  getList: getContractsListController,
  update: updateContractsController,
};

Object.freeze(contractController);

export default contractController;
