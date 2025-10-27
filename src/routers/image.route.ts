import { Router } from 'express';
import { upload } from '../lib/images.js';
import { postUpload } from '../users/controllers/image.upload.controller.js';

const MULTER_IMAGE_PATH = 'file';
const router = Router();

// multipart/form-data,
router.post('/upload', upload.single(MULTER_IMAGE_PATH), postUpload);

export default router;
