import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { downloadDocumentService } from '../services/document.download.service.js';

export async function downloadContractDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return next(createError(401, '로그인이 필요합니다'));

    const idStr = String(req.params.contractDocumentId ?? '').trim();
    const contractDocumentId = Number(idStr);

    const wantsJson = (req.query.mode as string) === 'json';

    await downloadDocumentService({
      actor: {
        id: req.user.id,
        companyId: req.user.companyId,
        isAdmin: req.user.isAdmin,
      },
      contractDocumentId,
      wantsJson,
      res,
    });
  } catch (err) {
    next(err);
  }
}
