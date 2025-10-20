import { downloadDocumentService } from './contract-document.download.service.js';
import { getDocumentDraftsService } from './contract-document.draft.service.js';
import { getDocumentsService } from './contract-document.get.service.js';
import { documentUploadTempService } from './contract-document.upload.service.js';

const documentService = {
  downloadDocumentService,
  getDocumentDraftsService,
  getDocumentsService,
  documentUploadTempService,
};

Object.freeze(documentService);

export default documentService;
