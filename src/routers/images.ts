import { Router } from 'express';
import { upload } from '../lib/images.js';
import { postUpload } from '../controllers/images/image.upload.js';

const MULTER_IMGAEPATH = 'file';
const router = Router();

// multipart/form-data,
router.post('/upload', upload.single(MULTER_IMGAEPATH), postUpload);

export default router;
