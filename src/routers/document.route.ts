import express from 'express';
import { postUploadTemp } from '../contractDocuments/controllers/document.upload.controller.js';
import { protect } from '../middlewares/auth.js';
import { uploadContract } from '../lib/document.upload.js';
import { getContractDocuments } from '../contractDocuments/controllers/document.get.controller.js';
import { getDocumentDrafts } from '../contractDocuments/controllers/document.draft.get.controller.js';
import { downloadContractDocument } from '../contractDocuments/controllers/document.download.controller.js';

const router = express.Router();
const DOCUMENT_FIELD_NAME = 'file';
// 라우터
router.post(
  '/upload',
  protect,
  uploadContract.single(DOCUMENT_FIELD_NAME),
  postUploadTemp
);

router.get('/', protect, getContractDocuments);
router.get('/draft', protect, getDocumentDrafts);
router.get('/:contractDocumentId/download', protect, downloadContractDocument);
export default router;
