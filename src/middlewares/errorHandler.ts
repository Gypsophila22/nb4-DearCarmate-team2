import { Prisma } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';
import { isHttpError } from 'http-errors';

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  void next;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let message = '데이터베이스 요청 오류입니다.';
    let status = 400;
    switch (err.code) {
      // Unique constraint
      case 'P2002': {
        status = 409;
        const model = String(err.meta?.modelName || '');
        const target = Array.isArray(err.meta?.target)
          ? err.meta?.target.join(', ')
          : String(err.meta?.target || '');

        if (model === 'Users' && target.includes('email')) {
          // 사용자 전역 유니크
          message = '이미 사용 중인 이메일입니다.';
        } else if (model === 'Customers' && target.includes('email')) {
          // 이중 유니크(companyId,email)라도, UI에선 회사 언급 X
          message = '이미 등록된 이메일입니다.';
        } else if (model === 'Companies' && /code/i.test(target)) {
          message = '이미 존재하는 회사 코드입니다.';
        } else if (model === 'Cars' && target.includes('carNumber')) {
          message = '이미 존재하는 차량 번호입니다.';
        } else if (
          model === 'CarModel' &&
          (target.includes('manufacturer,model') ||
            /manufacturer.*model/i.test(target))
        ) {
          message = '이미 존재하는 차종(제조사+모델)입니다.';
        } else {
          message = '고유 제약 조건 위반입니다.';
        }
        break;
      }
      // FK constraint
      case 'P2003': {
        status = 409;
        const field = err.meta?.field_name;
        // FK 제약 위반 (존재하지 않는 외래키 포함)
        if (typeof field === 'string' && field.includes('company')) {
          message = '존재하지 않는 회사 코드입니다.';
        } else {
          message = '관련된 데이터가 있어 삭제할 수 없습니다.';
        }
        break;
      }
      // Record not found
      case 'P2025': {
        status = 404;
        message = '존재하지 않는 데이터입니다.';
        break;
      }
      default:
        status = 400;
        message = `Prisma 오류(${err.code})가 발생했습니다.`;
    }

    console.error(`[${status}] PrismaError ${err.code}: ${message}`);
    return res
      .status(status)
      .json({ message, code: status, name: 'PrismaError' });
  }

  if (isHttpError(err)) {
    const status = err.status ?? err.statusCode ?? 500;
    console.error(`[${status}] ${err.name}: ${err.message}`);
    return res
      .status(status)
      .json({ message: err.message, code: status, name: err.name });
  } else {
    console.error(err);
    return res.status(500).send('서버 내부 오류입니다.');
  }
}
