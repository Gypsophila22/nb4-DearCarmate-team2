import express from 'express';
import passports from '../lib/passport/index.js';
import { uploadContract } from '../lib/document.upload.js';

import { contractDocumentSchema } from '../contractDocuments/schemas/contractDocument.schema.js';
import { contractDocumentController } from '../contractDocuments/controllers/contractDocument.controller.js';

const router = express.Router();
const DOCUMENT_FIELD_NAME = 'file';

// 라우터
router.post(
  '/upload',
  passports.jwtAuth,
  uploadContract.single(DOCUMENT_FIELD_NAME),
  contractDocumentController.postContractDocumentUploadTemp
);

router.get(
  '/',
  passports.jwtAuth,
  contractDocumentSchema.getContractDocument,
  contractDocumentController.getContractDocument
);
router.get(
  '/draft',
  passports.jwtAuth,
  contractDocumentController.getContractDocumentDraft
);
router.get(
  '/:contractDocumentId/download',
  passports.jwtAuth,
  contractDocumentSchema.getContractDocumentDownload,
  contractDocumentController.getContractDocumentDownload
);

export default router;
