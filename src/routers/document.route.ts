import express from 'express';
import { protect } from '../middlewares/auth.js';
import { uploadContract } from '../lib/document.upload.js';

import V from '../contractDocuments/schemas/index.js';
import C from '../contractDocuments/controllers/index.js';

const router = express.Router();
const DOCUMENT_FIELD_NAME = 'file';

// 라우터
router.post(
  '/upload',
  protect,
  uploadContract.single(DOCUMENT_FIELD_NAME),
  C.documentUploadTemp
);

router.get('/', protect, V.validateGetDocuments, C.getDocuments);
router.get('/draft', protect, C.getDocumentDrafts);
router.get(
  '/:contractDocumentId/download',
  protect,
  V.validateDownload,
  C.downloadContractDocument
);
export default router;
