import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { downloadDocumentService } from '../services/contract-document.download.service.js';
import { getDocumentDraftsService } from '../services/contract-document.draft.service.js';
import { getDocumentsService } from '../services/contract-document.get.service.js';
import { documentUploadTempService } from '../services/contract-document.upload.service.js';

class ContractDocumentController {
  async getContractDocumentDownload(
    req: Request,
    res: Response,
    next: NextFunction,
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

  async getContractDocumentDraft(
    req: Request,
    res: Response,
    next: NextFunction,
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

  async getContractDocument(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user)
        return res.status(401).json({ message: '로그인이 필요합니다.' });

      // 쿼리 파라미터 파싱
      const getOne = (v: unknown, def: string) =>
        Array.isArray(v) ? v[0] : typeof v === 'string' ? v : def;

      const page = Math.max(parseInt(getOne(req.query.page, '1'), 10) || 1, 1);
      const raw = parseInt(getOne(req.query.pageSize, '10'), 10) || 10;
      const pageSize = Math.min(Math.max(raw, 1), 100);

      const searchBy = getOne(req.query.searchBy, '').trim() || undefined;
      const keyword = getOne(req.query.keyword, '').trim() || undefined;

      const result = await getDocumentsService({
        actor: {
          id: req.user.id,
          companyId: req.user.companyId,
          isAdmin: !!req.user.isAdmin,
        },
        page,
        pageSize,
        ...(searchBy ? { searchBy } : {}),
        ...(keyword ? { keyword } : {}),
      });
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async postContractDocumentUploadTemp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user)
        return res.status(401).json({ message: '로그인이 필요합니다.' });
      if (!req.file)
        return res.status(400).json({ message: '파일은 필수입니다.' });

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
}

export const contractDocumentController = new ContractDocumentController();
