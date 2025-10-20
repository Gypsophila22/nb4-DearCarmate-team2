import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "../customers/controllers/index.js";
import { uploadCustomers, upload } from "../customers/controllers/uploadCustomers.js";
import passports from '../lib/passport/index.js';

const customersRouter = Router();

// 아래의 라우트들은 로그인이 되어 있어야만 접근이 가능
customersRouter.use(passports.jwtAuth);

// 고객 목록 조회
customersRouter.get("/", getCustomers);

// 고객 등록
customersRouter.post("/", createCustomer);

// 고객 상세 정보 조회
customersRouter.get("/:id", getCustomerById);

// 고객 수정
customersRouter.patch("/:id", updateCustomer);

// 고객 삭제
customersRouter.delete("/:id", deleteCustomer);

// 고객 CSV 대용량 업로드
customersRouter.post("/upload", upload.single('csvfile'), uploadCustomers);

export default customersRouter;
