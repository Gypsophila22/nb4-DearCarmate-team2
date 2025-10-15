import { Router } from 'express';
import { uploadCustomersController } from '../upload/controllers/uploadCustomers.js';
import { uploadCarsController } from '../upload/contrllers/uploadCars.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/customers/upload', upload.single('file'), uploadCustomersController);
router.post('/cars/upload', upload.single('file'), uploadCarsController);

export default router;