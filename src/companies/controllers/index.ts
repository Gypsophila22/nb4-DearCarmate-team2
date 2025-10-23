import { createCompany } from './company.post.controller.js';
import { getCompany } from './company.get.controller.js';
import { getCompanyUsers } from './company.get-user.controller.js';
import { patchCompany } from './company.patch.controller.js';
import { deleteCompany } from './company.delete.controller.js';

// 각 컨트롤러 모음 객체
const companyController = {
  createCompany,
  getCompany,
  getCompanyUsers,
  patchCompany,
  deleteCompany,
};

export default companyController;
