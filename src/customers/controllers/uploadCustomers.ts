import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import multer from 'multer';
import { customerUploadService } from '../services/customer.upload.service.js';
import { customerParseService } from '../services/customer.parse.service.js';

// 파일을 메모리 저장소에 임시 저장
const upload = multer({ storage: multer.memoryStorage() });
export { upload };

export const uploadCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    // 파일 존재 확인
    if (!req.file) {
      throw createError(400, '업로드된 파일이 없습니다.');
    }

    // CSV 파일인지 확인
    if (req.file.mimetype !== 'text/csv') {
      throw createError(400, 'CSV 파일만 업로드할 수 있습니다');
    }

    const csvBuffer = req.file.buffer; // Buffer로 가져옴

    // CSV 파싱, 유효성 검사
    const { results: validCustomers, errors: validationErrors } =
      await customerParseService.parseAndValidateCsv(csvBuffer);

    const dbProcessResults = await customerUploadService.processCustomerCsv(
      validCustomers,
      companyId,
    );

    res.status(200).json({
      message: 'CSV 파일 업로드 요청을 받았습니다.',
      fileName: req.file.originalname,
      totalRecords: validCustomers.length + validationErrors.length,
      processedSuccessfully: validCustomers.length,
      failedRecords: validationErrors.length,
      validationErrors: validationErrors,
      databaseErrors: dbProcessResults.errors,
    });
  } catch (error) {
    next(error);
  }
};
