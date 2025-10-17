import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';
import { decodeLatin1ToUtf8 } from '../../lib/filename.js';

export async function postUploadTemp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return res.status(401).json({ message: '로그인 필요' });
    if (!req.file) return res.status(400).json({ message: '파일 필수' });
    const originalName = decodeLatin1ToUtf8(req.file.originalname);
    const doc = await prisma.contractDocuments.create({
      data: {
        companyId: req.user.companyId,
        uploaderId: req.user.id,
        originalName: req.file.originalname,
        storedName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path ?? null,
        status: 'TEMP',
      },
      select: { id: true },
    });

    return res.json({ contractDocumentId: doc.id });
  } catch (e) {
    next(e);
  }
}
