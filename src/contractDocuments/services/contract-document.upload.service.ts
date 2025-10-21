import { contractDocumentRepository } from '../repositories/contract-document.repository.js';
import { decodeLatin1ToUtf8 } from '../../lib/filename.js';
import path from 'path';

type Actor = { id: number; companyId: number; isAdmin?: boolean };

export async function documentUploadService(args: {
  actor: Actor;
  contractId?: number;
  file: {
    originalname: string;
    filename: string;
    mimetype: string;
    size: number;
    path?: string;
  };
}) {
  const originalName = decodeLatin1ToUtf8(args.file.originalname);
  const relativePath = path.posix.join(
    'contract-documents',
    args.file.filename,
  );

  // 1) DB insert (연결 여부는 나중 PATCH에서 처리)
  const created = await contractDocumentRepository.create({
    companyId: args.actor.companyId,
    uploaderId: args.actor.id,
    contractId: args.contractId,
    originalName,
    storedName: args.file.filename,
    mimeType: args.file.mimetype,
    size: args.file.size,
    path: relativePath,
  });
  // 업로드는 여기서 종료 (메일은 PATCH에서 새로 연결된 문서만 발송)
  return { contractDocumentId: created.id };
}
