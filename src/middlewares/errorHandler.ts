import type { Request, Response, NextFunction } from 'express';
// import httpError from 'http-errors';

// export default function errorHandler(
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   if (httpError(err)) {
//     const errMsg = `서버 에러, 코드 : ${err.status}, 에러명 : ${err.message}`;

//     console.error(errMsg);
//     return res.status(err.status).send(errMsg);
//   }
// }

import { isHttpError } from 'http-errors';
import { MulterError } from 'multer';

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  // 업로드 에러
  void next;
  if (err instanceof MulterError) {
    const status = 400;
    console.error(`[${status}] MulterError:`, err);
    return res
      .status(status)
      .json({ message: err.message, code: status, name: 'MulterError' });
  }

  // http-errors 에러
  if (isHttpError(err)) {
    const status = err.status ?? err.statusCode ?? 500;
    console.error(`[${status}] ${err.name}: ${err.message}`);
    return res
      .status(status)
      .json({ message: err.message, code: status, name: err.name });
  }

  // 그 외 일반 에러도 JSON으로
  const status = 500;
  const msg =
    typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : '서버 오류가 발생했습니다.';
  console.error(`[${status}] UnknownError:`, err);
  return res.status(status).json({ message: msg, code: status, name: 'Error' });
}
