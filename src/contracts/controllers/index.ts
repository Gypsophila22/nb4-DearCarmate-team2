import { createContractsController } from './createContractsController.js';
import { deleteContractsController } from './deleteContractsController.js';
import { getCarsListForContractController } from './getCarsListForContractsController.js';
import { getContractsListController } from './getContractsListController.js';
import { getCustomersListForContractController } from './getCustomersListForContractController.js';
import { getUsersListForContractController } from './getUsersListForContractController.js';
import { updateContractsController } from './updateContractsController.js';

const contractController = {
  create: createContractsController,
  getList: getContractsListController,
  update: updateContractsController,
  delete: deleteContractsController,
  getCarList: getCarsListForContractController,
  getCustomerList: getCustomersListForContractController,
  getUsersList: getUsersListForContractController,
};

Object.freeze(contractController);

export default contractController;
