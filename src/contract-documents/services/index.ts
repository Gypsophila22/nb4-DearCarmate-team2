import { downloadDocumentService } from './contract-document.download.service.js';
import { getDocumentDraftsService } from './contract-document.draft.service.js';
import { getDocumentsService } from './contract-document.get.service.js';
import { documentUploadService } from './contract-document.upload.service.js';

const documentService = {
  downloadDocumentService,
  getDocumentDraftsService,
  getDocumentsService,
  documentUploadService,
};

Object.freeze(documentService);

export default documentService;
