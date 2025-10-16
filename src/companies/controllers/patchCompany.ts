import prisma from "../../config/prisma.js";
import { companyRepository } from "../repositories/companyRepository.js";
import errorHandler from "../../middlewares/errorHandler.js";

///////////////////////////////////////////
//임시 에러핸들러 부분입니다. 기능 구연 목적의 임시 코드
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
/////////////////////////////////////////


const patchCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { companyName, companyCode } = req.body;

    //  // 🔐 관리자 권한 확인
    // if (!req.user || !req.user.isAdmin) {
    //   throw new UnauthorizedError("관리자 권한이 필요합니다");
    // }

    // 1️⃣ 요청 검증
    if (!companyId || !companyName?.trim() || !companyCode?.trim()) {
      throw new BadRequestError("잘못된 요청입니다");
    }

    const id = Number(companyId);

    // 2️⃣ 존재 확인
    const exist = await prisma.companies.findUnique({
      where: { id },
    });

    if (!exist) throw new NotFoundError("존재하지 않는 회사입니다");

    // 3️⃣ 수정 실행 (Repository 호출)
    const company = await companyRepository.updateCompanyById(id, { companyName, companyCode });

    // 4️⃣ 응답 매핑 (명세서 형식)
    return res.status(200).json({
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount: company.userCount,
    });
  } catch (err) {
    // 5️⃣ 에러 처리
    if (err instanceof BadRequestError || err instanceof NotFoundError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err); // 기타 예외는 전역 에러핸들러로
  }
};


export default patchCompany;

