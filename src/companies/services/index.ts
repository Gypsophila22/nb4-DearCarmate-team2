import { deleteCompanyService } from './company.delete.service.js';
import { getCompanyUsersService } from './company.get-user.service.js';
import { getCompanyService } from './company.get.service.js';
import { patchCompanyService } from './company.patch.service.js';
import { createCompanyService } from './company.post.service.js';

const companyService = {
  deleteCompanyService,
  getCompanyService,
  getCompanyUsersService,
  patchCompanyService,
  createCompanyService,
};

export default companyService;
