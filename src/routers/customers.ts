import { Router } from 'express';
import { postCustomers, getCustomers, updateCustomers, deleteCustomers } from '../controllers/customers/index.js';
import { protect } from '../middlewares/auth.js'; // 인증 미들웨어

const customersRouter = Router();

// 아래의 라우트들은 로그인이 되어 있어야만 접근이 가능
customersRouter.use(protect);

// 고객 등록
customersRouter.post('/', postCustomers);

// 고객 목록 조회
customersRouter.get('/', getCustomers);

// 고객 수정
customersRouter.put('/:id', updateCustomers);

// 고객 삭제
customersRouter.delete('/:id', deleteCustomers);

export default customersRouter;
