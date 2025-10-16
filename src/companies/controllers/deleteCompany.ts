import prisma from "../../config/prisma.js";
import { companyRepository } from "../repositories/companyRepository.js";

// ----- 에러 클래스 -----
class BadRequestError extends Error {
  statusCode: number;
  constructor(message = "잘못된 요청입니다") {
    super(message);
    this.statusCode = 400;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

class NotFoundError extends Error {
  statusCode: number;
  constructor(message = "존재하지 않는 회사입니다") {
    super(message);
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message = "관리자 권한이 필요합니다") {
    super(message);
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// ----- 컨트롤러 -----
const deleteCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    // // 🔐 관리자 권한 확인
    // if (!req.user || !req.user.isAdmin) {
    //   throw new UnauthorizedError();
    // }

    // 1️⃣ 요청값 검증
    if (!companyId) {
      throw new BadRequestError("잘못된 요청입니다");
    }

    const id = Number(companyId);

    // 2️⃣ 존재 확인
    const exist = await prisma.companies.findUnique({ where: { id } });
    if (!exist) throw new NotFoundError();

    // 3️⃣ 삭제 실행
    const result = await companyRepository.deleteCompanyById(id);

    // 4️⃣ 응답
    return res.status(200).json(result);
  } catch (err) {
    if (
      err instanceof BadRequestError ||
      err instanceof NotFoundError ||
      err instanceof UnauthorizedError
    ) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

export default deleteCompany;