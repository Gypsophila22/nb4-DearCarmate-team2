// src/contractDocuments/services/documentDownload.get.service.ts
import type { Response } from 'express';
import path from 'path';
import { existsSync, statSync, createReadStream } from 'fs';
import contentDisposition from 'content-disposition';
import mime from 'mime';
import createError from 'http-errors';
import { documentDownloadRepository } from '../repositories/document.download.repository.js';

type Actor = { id: number; companyId: number; isAdmin?: boolean };

function absPathOrDefault(relPath: string | null | undefined, stored: string) {
  const base = path.join(process.cwd(), 'uploads', 'contractDocuments');
  if (relPath)
    return path.isAbsolute(relPath)
      ? relPath
      : path.join(process.cwd(), relPath);
  return path.join(base, stored);
}

export async function downloadDocumentService(args: {
  actor: Actor;
  contractDocumentId: number; // ← 이름 통일
  wantsJson: boolean;
  res: Response;
}) {
  const { actor, contractDocumentId, wantsJson, res } = args;

  const doc = await documentDownloadRepository.findByIdForCompany({
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
    throw createError(410, '파일이 존재하지 않습니다(삭제되었을 수 있음)');

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
  stream.on('error', (e) => res.destroy(e as Error));
  stream.pipe(res);
}
