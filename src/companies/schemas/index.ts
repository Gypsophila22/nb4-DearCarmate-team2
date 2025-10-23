import { deleteCompanySchema } from './company.delete.schema.js';
import { getCompanyUsersQuerySchema } from './company.get-user.schema.js';
import { getCompanyQuerySchema } from './company.get.schema.js';
import { patchCompanySchema } from './company.patch.schema.js';
import { createCompanySchema } from './company.post.schema.js';

const CompanySchema = {
  createCompanySchema,
  getCompanyQuerySchema,
  getCompanyUsersQuerySchema,
  patchCompanySchema,
  deleteCompanySchema,
};

export default CompanySchema;
