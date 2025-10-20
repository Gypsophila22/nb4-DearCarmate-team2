import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "../customers/controllers/index.js";
import { protect } from "../middlewares/auth.js"; // 인증 미들웨어
import { uploadCustomers, upload } from "../customers/controllers/uploadCustomers.js";
import { validate } from '../middlewares/validate.zod.js';
import customerValidation from '../customers/schemas/index.js';

const customersRouter = Router();

// 아래의 라우트들은 로그인이 되어 있어야만 접근이 가능
customersRouter.use(protect);

// 고객 목록 조회
customersRouter.get("/", validate(customerValidation.getCustomersSchema), getCustomers);

// 고객 등록
customersRouter.post("/", validate(customerValidation.createCustomerSchema), createCustomer);

// 고객 상세 정보 조회
customersRouter.get("/:id", validate(customerValidation.getCustomerByIdSchema), getCustomerById);

// 고객 수정
customersRouter.patch("/:id", validate(customerValidation.updateCustomerSchema), updateCustomer);

// 고객 삭제
customersRouter.delete("/:id", validate(customerValidation.deleteCustomerSchema), deleteCustomer);

// 고객 CSV 대용량 업로드
customersRouter.post("/upload", upload.single('csvfile'), uploadCustomers);

export default customersRouter;