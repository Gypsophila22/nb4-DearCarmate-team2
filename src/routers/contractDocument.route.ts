import express from 'express';
import { protect } from '../middlewares/auth.js';
import { uploadContract } from '../lib/document.upload.js';

import { contractDocumentSchema } from '../contractDocuments/schemas/contractDocument.schema.js';
import { contractDocumentController } from '../contractDocuments/controllers/contractDocument.controller.js';

const router = express.Router();
const DOCUMENT_FIELD_NAME = 'file';

// 라우터
router.post(
  '/upload',
  protect,
  uploadContract.single(DOCUMENT_FIELD_NAME),
  contractDocumentController.postContractDocumentUploadTemp
);

router.get(
  '/',
  protect,
  contractDocumentSchema.getContractDocument,
  contractDocumentController.getContractDocument
);
router.get(
  '/draft',
  protect,
  contractDocumentController.getContractDocumentDraft
);
router.get(
  '/:contractDocumentId/download',
  protect,
  contractDocumentSchema.getContractDocumentDownload,
  contractDocumentController.getContractDocumentDownload
);

export default router;
