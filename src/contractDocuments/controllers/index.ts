import { documentUploadTempController } from './document.upload.controller.js';
import { getDocumentDraftsController } from './document.draft.get.controller.js';
import { getDocumentsController } from './document.get.controller.js';
import { downloadContractDocumentController } from './document.download.controller.js';

const documentController = {
  documentUploadTempController,
  getDocumentDraftsController,
  getDocumentsController,
  downloadContractDocumentController,
};

Object.freeze(documentController);

export default documentController;
