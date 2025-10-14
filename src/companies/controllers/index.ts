//controllers/companies/index.ts

import postCompany from "./postCompany.js";
import getCompany from "./getCompany.js";
import patchCompany from "./patchCompany.js";
import deleteCompany from "./deleteCompany.js";
import getCompanyUsers from "./getCompanyUsers.js";

const companyController = {
  ...postCompany,
  ...getCompany,
  ...patchCompany,
  ...deleteCompany,
  ...getCompanyUsers,
};

export default companyController;
