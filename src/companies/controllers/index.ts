//controllers/companies/index.ts
import createCompany from './postCompany.js';
import getCompany from './getCompany.js';
import patchCompany from './patchCompany.js';
import deleteCompany from './deleteCompany.js';
import getCompanyUsers from './getCompanyUsers.js';

const companyController = {
  ...createCompany,
  ...getCompany,
  ...getCompanyUsers,
  updateCompany: patchCompany,
  deleteCompany,
};

export default companyController;
