// controllers/companies/index.ts
import { createCompany } from './company.postcontroller.js';
import { getCompany } from './company.get.controller.js';
import { getCompanyUsers } from './company.getUsers.controller.js';
import { patchCompany } from './company.patch.controller.js';
import { deleteCompany } from './company.delete.controller.js';

export const companyController = {
  createCompany,
  getCompany,
  getCompanyUsers,
  patchCompany,
  deleteCompany,
};
