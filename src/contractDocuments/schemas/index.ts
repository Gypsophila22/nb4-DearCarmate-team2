import { validateDownloadSchema } from './document.download.schema.js';
import { getDocumentsQuerySchema } from './document.get.schema.js';

const documentValidation = {
  validateDownloadSchema,
  getDocumentsQuerySchema,
};

Object.freeze(documentValidation);

export default documentValidation;
