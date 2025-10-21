// controllers/companies/index.ts
import { createCompany } from "./postCompany.js";
import { getCompany } from "./getCompany.js";
import {getCompanyUsers } from "./getCompanyUsers.js";
import { patchCompany } from "./patchCompany.js";
import { deleteCompany } from "./deleteCompany.js";

export const companyController = {
  createCompany,
  getCompany,
  getCompanyUsers,
  patchCompany,
  deleteCompany,
};
