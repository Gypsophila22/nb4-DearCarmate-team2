import { documentUploadRepository } from './document.upload.repository.js';
import { documentDraftsRepository } from './document.draft.repository.js';
import { documentGetRepository } from './document.get.repository.js';
import { documentDownloadRepository } from './document.download.repository.js';

const documentRepository = {
  documentUploadRepository,
  documentDraftsRepository,
  documentGetRepository,
  documentDownloadRepository,
};

Object.freeze(documentRepository);

export default documentRepository;
