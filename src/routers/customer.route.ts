import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from '../customers/controllers/index.js';
import {
  uploadCustomers,
  upload,
} from '../customers/controllers/uploadCustomers.js';
import passports from '../lib/passport/index.js';
import { customerValidation } from '../customers/schemas/index.js';

const customersRouter = Router();

// 아래의 라우트들은 로그인이 되어 있어야만 접근이 가능
customersRouter.use(passports.jwtAuth);

// 고객 목록 조회
customersRouter.get('/', customerValidation.getCustomers, getCustomers);

// 고객 등록
customersRouter.post('/', customerValidation.createCustomer, createCustomer);

// 고객 상세 정보 조회
customersRouter.get('/:id', customerValidation.getCustomerById, getCustomerById);

// 고객 수정
customersRouter.patch('/:id', customerValidation.updateCustomer, updateCustomer);

// 고객 삭제
customersRouter.delete('/:id', customerValidation.deleteCustomer, deleteCustomer);

// 고객 CSV 대용량 업로드
customersRouter.post('/upload', upload.single('file'), uploadCustomers);

export default customersRouter;