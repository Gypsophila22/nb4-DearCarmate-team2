import type { Request, Response, NextFunction } from 'express';
import { buildImageUrl } from '../../lib/images.js';
import createError from 'http-errors';

export async function postUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return next(createError(400, '파일이 없습니다.'));
    }
    const imageUrl = buildImageUrl(req, req.file.filename);

    return res.status(201).json({ imageUrl });
  } catch (err) {
    console.error(err);
    return next(createError(500, '이미지 업로드 처리 중 오류가 발생했습니다.'));
  }
}
