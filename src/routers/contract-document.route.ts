import express from 'express';
import passports from '../lib/passport/index.js';
import { uploadContract } from '../lib/contract-document.upload.js';

import { contractDocumentSchema } from '../contract-documents/schemas/contract-document.schema.js';
import { contractDocumentController } from '../contract-documents/controllers/contract-document.controller.js';

const router = express.Router();
const DOCUMENT_FIELD_NAME = 'file';

// 라우터
router.post(
  '/upload',
  passports.jwtAuth,
  uploadContract.single(DOCUMENT_FIELD_NAME),
  contractDocumentController.postContractDocumentUpload,
);

router.get(
  '/',
  passports.jwtAuth,
  contractDocumentSchema.getContractDocument,
  contractDocumentController.getContractDocument,
);
router.get(
  '/draft',
  passports.jwtAuth,
  contractDocumentController.getContractDocumentDraft,
);
router.get(
  '/:contractDocumentId/download',
  passports.jwtAuth,
  contractDocumentSchema.getContractDocumentDownload,
  contractDocumentController.getContractDocumentDownload,
);

export default router;
