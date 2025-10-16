import { createContractsController } from './createContractsController.js';
import { deleteContractsController } from './deleteContractsController.js';
import { getContractsListController } from './getContractsListController.js';
import { updateContractsController } from './updateContractsController.js';

const contractController = {
  create: createContractsController,
  getList: getContractsListController,
  update: updateContractsController,
  delete: deleteContractsController,
};

Object.freeze(contractController);

export default contractController;
