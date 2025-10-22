import type { Response } from 'express';
import path from 'path';
import { existsSync, statSync, createReadStream } from 'fs';
import contentDisposition from 'content-disposition';
import mime from 'mime';
import createError from 'http-errors';
import { contractDocumentRepository } from '../repositories/contract-document.repository.js';

type Actor = { id: number; companyId: number; isAdmin?: boolean };

const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
const DOC_BASE = path.join(UPLOADS_ROOT, 'contract-documents');

function absPathOrDefault(relPath: string | null | undefined, stored: string) {
  // 상대경로면 cwd가 아니라 uploads/
  const candidate = relPath
    ? path.isAbsolute(relPath)
      ? relPath
      : path.join(UPLOADS_ROOT, relPath)
    : path.join(DOC_BASE, stored);

  const abs = path.normalize(candidate);
  // uploads 밖으로 벗어나는 경로 차단
  if (!abs.startsWith(path.normalize(UPLOADS_ROOT))) {
    throw createError(400, '잘못된 경로입니다');
  }
  return abs;
}

export async function downloadDocumentService(args: {
  actor: Actor;
  contractDocumentId: number;
  wantsJson: boolean;
  res: Response;
}) {
  const { actor, contractDocumentId, wantsJson, res } = args;

  const doc = await contractDocumentRepository.findByIdForCompany({
    contractDocumentId,
    companyId: actor.companyId,
  });
  if (!doc) throw createError(404, '문서를 찾을 수 없습니다');

  if (wantsJson) {
    res.status(200).json({ message: '계약서 다운로드 성공' });
    return;
  }

  res.setHeader('Cache-Control', 'no-store');

  if (doc.url) {
    res.redirect(302, doc.url);
    return;
  }

  const full = absPathOrDefault(doc.path, doc.storedName);
  if (!existsSync(full))
    throw createError(410, '파일이 존재하지 않습니다(삭제되었을 수 있음2)');

  const filename = doc.originalName || doc.storedName;
  const type =
    doc.mimeType ||
    mime.getType(path.extname(filename)) ||
    'application/octet-stream';
  const size = statSync(full).size;

  res.setHeader('Content-Type', type);
  res.setHeader('Content-Length', String(size));
  res.setHeader('Content-Disposition', contentDisposition(filename));

  const stream = createReadStream(full);
  stream.on('error', (e) => res.destroy(e));
  stream.pipe(res);
}
