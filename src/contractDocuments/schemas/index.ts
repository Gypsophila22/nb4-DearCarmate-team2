import { validateDownload } from './document.download.schema.js';
import { validateGetDocuments } from './document.get.schema.js';

const documentValidation = { validateDownload, validateGetDocuments };

Object.freeze(documentValidation);

export default documentValidation;
