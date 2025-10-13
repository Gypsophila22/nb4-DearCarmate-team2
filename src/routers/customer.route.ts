import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "../controllers/customers/index.js";
import { protect } from "../middlewares/auth.js"; // 인증 미들웨어

const customersRouter = Router();

// 아래의 라우트들은 로그인이 되어 있어야만 접근이 가능
customersRouter.use(protect);

// 고객 목록 조회
customersRouter.get("/", getCustomers);

// 고객 등록
customersRouter.post("/", createCustomer);

// 고객 상세 정보 조회
customersRouter.get("/:id", getCustomerById);

// 고객 수정
customersRouter.put("/:id", updateCustomer);

// 고객 삭제
customersRouter.delete("/:id", deleteCustomer);

export default customersRouter;
