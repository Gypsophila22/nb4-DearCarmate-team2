import { documentUploadTemp } from './document.upload.controller.js';
import { getDocumentDrafts } from './document.draft.get.controller.js';
import { getDocuments } from './document.get.controller.js';
import { downloadContractDocument } from './document.download.controller.js';

const documentController = {
  documentUploadTemp,
  getDocumentDrafts,
  getDocuments,
  downloadContractDocument,
};

Object.freeze(documentController);

export default documentController;
