import { downloadDocumentService } from './document.download.service.js';
import { getDocumentDraftsService } from './document.draft.service.js';
import { getDocumentsService } from './document.get.service.js';
import { documentUploadTempService } from './document.upload.service.js';

const documentService = {
  downloadDocumentService,
  getDocumentDraftsService,
  getDocumentsService,
  documentUploadTempService,
};

Object.freeze(documentService);

export default documentService;
