import { Router } from 'express';
import multer from 'multer';

import { uploadCarsController } from '../upload/contrllers/uploadCars.js';
import { uploadCustomersController } from '../upload/controllers/uploadCustomers.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/customers/upload',
  upload.single('file'),
  uploadCustomersController,
);
router.post('/cars/upload', upload.single('file'), uploadCarsController);

export default router;
