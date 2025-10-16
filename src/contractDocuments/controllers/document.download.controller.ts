import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import prisma from '../../lib/prisma.js';

function toAbs(p: string | null, stored: string) {
  return p
    ? path.isAbsolute(p)
      ? p
      : path.join(process.cwd(), p)
    : path.join(process.cwd(), 'uploads', 'contracts', stored);
}

export async function downloadContractDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(
      'body.contractId=',
      req.body?.contractId,
      'query.contractId=',
      req.query?.contractId,
      'x-contract-id=',
      req.headers['x-contract-id']
    );

    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });

    const idStr = String((req.params as any)?.id ?? '').trim();
    if (!/^\d+$/.test(idStr)) {
      return res.status(400).json({ message: '잘못된 문서 ID입니다' });
    }
    const id = Number(idStr);

    // 1) 먼저 "문서 ID"로 시도
    let doc = await prisma.contractDocuments.findFirst({
      where: { id, companyId: req.user.companyId },
      select: {
        id: true,
        originalName: true,
        storedName: true,
        path: true,
        contractId: true,
      },
    });
    let resolved: 'by-document' | 'by-contract-latest' | null = null;

    // 2) 없으면 "계약 ID의 최신 문서"로 폴백
    if (!doc) {
      const latest = await prisma.contractDocuments.findFirst({
        where: { contractId: id, companyId: req.user.companyId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          originalName: true,
          storedName: true,
          path: true,
          contractId: true,
        },
      });
      if (!latest)
        return res.status(404).json({ message: '문서를 찾을 수 없습니다' });
      doc = latest;
      resolved = 'by-contract-latest';
    } else {
      resolved = 'by-document';
    }

    const absPath = toAbs(doc.path as any, doc.storedName);
    if (!fs.existsSync(absPath)) {
      return res
        .status(410)
        .json({ message: '파일이 존재하지 않습니다(삭제되었을 수 있음)' });
    }

    // 명세 JSON만 확인하고 싶을 때: ?mode=json
    if ((req.query.mode as string) === 'json') {
      if (resolved === 'by-contract-latest')
        res.setHeader('X-Download-Resolved', 'by-contract-latest');
      return res.status(200).json({ message: '계약서 다운로드 성공' });
    }

    if (resolved === 'by-contract-latest')
      res.setHeader('X-Download-Resolved', 'by-contract-latest');
    res.set('Cache-Control', 'no-store');
    return res.download(absPath, doc.originalName);
  } catch (err) {
    next(err);
  }
}
