import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

export async function uploadContractDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });
    if (!req.file)
      return res.status(400).json({ message: '파일이 필요합니다' });
    const contractId = Number(req.params.contractId);
    if (!Number.isInteger(contractId) || contractId <= 0) {
      return res.status(400).json({ message: '잘못된 요청입니다' }); // ⬅️ 여기서 종료
    }

    console.log('contractId :', contractId);

    const data: any = {
      uploaderId: req.user.id,
      companyId: req.user.companyId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path!,
    };
    if (contractId) data.contractId = contractId;

    const doc = await prisma.contractDocuments.create({
      data,
      select: { id: true },
    });
    return res.status(200).json({ contractDocumentId: doc.id });
  } catch (e) {
    next(e);
  }
}
