import type { Request, Response, NextFunction } from 'express';
import { documentUploadTempService } from '../services/document.upload.service.js';

export async function documentUploadTempController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return res.status(401).json({ message: '로그인 필요' });
    if (!req.file) return res.status(400).json({ message: '파일 필수' });

    const result = await documentUploadTempService({
      actor: {
        id: req.user.id,
        companyId: req.user.companyId,
        isAdmin: req.user.isAdmin,
      },
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path ?? null,
      },
    });

    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
