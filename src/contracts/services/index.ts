import { contractCreateService } from './contract.create.service.js';
import { contractDeleteService } from './contract.delete.service.js';
import { contractGetCarListService } from './contract.get-car-list.service.js';
import { contractGetListService } from './contract.get-list.service.js';
import { contractGetCustomerListService } from './contract.get-customer-list.service.js';
import { contractGetUserListService } from './contract.get-user-list.service.js';
import { contractUpdateService } from './contract.update-contracts.service.js';

const contractService = {
  create: contractCreateService,
  update: contractUpdateService,
  getList: contractGetListService,
  delete: contractDeleteService,
  getCarsListForContract: contractGetCarListService,
  getUsersListForContract: contractGetUserListService,
  getCustomersListForContract: contractGetCustomerListService,
};

Object.freeze(contractService);

export default contractService;
