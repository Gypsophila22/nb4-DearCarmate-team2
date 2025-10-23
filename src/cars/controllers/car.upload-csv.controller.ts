import carService from '../services/index.js';
import createError from 'http-errors';

import type { Request, Response, NextFunction } from 'express';

// 차량 csv 업로드 컨트롤러
export const carUploadCsvController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 업로드 파일 확인
    if (!req.file) {
      throw createError(400, 'CSV 파일이 업로드되지 않았습니다');
    }

    // 차량 csv 파일 업로드 서비스 호출 (차량 추가)
    await carService.uploadCsv(req.file.buffer);

    return res.status(201).json({ message: '성공적으로 등록되었습니다' });
  } catch (err) {
    next(err);
  }
};
