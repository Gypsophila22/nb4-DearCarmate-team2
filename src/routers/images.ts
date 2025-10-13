import { Router } from 'express';
import { upload } from '../lib/images.js';
import { postUpload } from '../controllers/images/postUpload.js';

const router = Router();

// multipart/form-data, 필드명: image
router.post('/upload', upload.single('image'), postUpload);

export default router;
