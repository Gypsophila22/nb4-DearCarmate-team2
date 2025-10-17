import type { Request, Response, NextFunction } from 'express';
import { getDocumentDraftsService } from '../services/document.draft.service.js';

export async function getDocumentDraftsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });

    const items = await getDocumentDraftsService({
      id: req.user.id,
      companyId: req.user.companyId,
      isAdmin: req.user.isAdmin,
    });

    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}
