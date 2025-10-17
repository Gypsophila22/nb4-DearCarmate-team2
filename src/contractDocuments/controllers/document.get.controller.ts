import type { Request, Response, NextFunction } from 'express';
import { getDocumentsService } from '../services/document.get.service.js';

export async function getDocuments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });

    // 쿼리 파라미터 파싱
    const page = Math.max(
      parseInt((req.query.page as string) ?? '1', 10) || 1,
      1
    );
    const pageSizeRaw =
      parseInt((req.query.pageSize as string) ?? '10', 10) || 10;
    const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100);

    const searchBy = (req.query.searchBy as string | undefined)?.trim();
    const keyword = (req.query.keyword as string | undefined)?.trim();

    const result = await getDocumentsService({
      actor: {
        id: req.user.id,
        companyId: req.user.companyId as number, // 타입 맞추기
        isAdmin: !!req.user.isAdmin,
      },
      page,
      pageSize,
      ...(searchBy ? { searchBy } : {}),
      ...(keyword ? { keyword } : {}),
    });
    // 디버깅
    console.log('실제 결과: ', result);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
