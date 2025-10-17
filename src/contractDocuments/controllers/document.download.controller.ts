import type { Request, Response, NextFunction } from 'express';
import fs, { createReadStream, existsSync, statSync } from 'fs';
import path from 'path';
import prisma from '../../lib/prisma.js';
import createError from 'http-errors';
import contentDisposition from 'content-disposition';
import mime from 'mime';

function absPathOrDefault(relPath: string | null | undefined, stored: string) {
  const base = path.join(process.cwd(), 'uploads', 'contractDocuments'); // 업로더와 동일
  if (relPath)
    return path.isAbsolute(relPath)
      ? relPath
      : path.join(process.cwd(), relPath);
  return path.join(base, stored);
}

export async function downloadContractDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) return next(createError(401, '로그인이 필요합니다'));

    const idStr = String(req.params.contractDocumentId ?? '').trim();
    if (!/^\d+$/.test(idStr))
      return next(createError(400, '잘못된 문서 ID입니다'));
    const documentId = Number(idStr);

    const doc = await prisma.contractDocuments.findFirst({
      where: { id: documentId, companyId: req.user.companyId },
      select: {
        id: true,
        originalName: true,
        storedName: true,
        path: true,
        url: true, // S3 등 외부 저장 시
        mimeType: true, // 스키마에 있으면 사용
      },
    });
    if (!doc) return next(createError(404, '문서를 찾을 수 없습니다'));

    const wantsJson =
      (req.query.mode as string) === 'json' ||
      (req.headers.accept ?? '').includes('application/json');
    if (wantsJson) {
      return res.status(200).json({ message: '계약서 다운로드 성공' });
    }

    // 외부 저장소 URL이면 리다이렉트
    if (doc.url) {
      res.setHeader('Cache-Control', 'no-store');
      return res.redirect(302, doc.url);
    }

    // 로컬 파일 스트리밍
    const full = absPathOrDefault(doc.path, doc.storedName);
    if (!existsSync(full)) {
      return next(
        createError(410, '파일이 존재하지 않습니다(삭제되었을 수 있음)')
      );
    }

    // 안전한 파일명 및 헤더
    const filename = doc.originalName || doc.storedName;
    const disposition = contentDisposition(filename); // RFC5987: filename*
    const type =
      doc.mimeType ||
      mime.getType(path.extname(filename)) ||
      'application/octet-stream';
    const size = statSync(full).size;

    // ⚠️ 바이너리 변형 방지(압축 미들웨어 등과 충돌 방지)
    res.setHeader('Content-Type', type);
    res.setHeader('Content-Length', String(size));
    res.setHeader('Content-Disposition', disposition);
    res.setHeader('Cache-Control', 'no-store');

    // 안정적인 스트리밍
    const stream = createReadStream(full);
    stream.on('error', (err) => next(err));
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
}
