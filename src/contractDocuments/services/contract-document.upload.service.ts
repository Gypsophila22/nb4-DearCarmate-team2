import { contractDocumentRepository } from '../repositories/contract-document.repository.js';
import { decodeLatin1ToUtf8 } from '../../lib/filename.js';

type Actor = { id: number; companyId: number; isAdmin?: boolean };

export async function documentUploadService(args: {
  actor: Actor;
  file: {
    originalname: string;
    filename: string;
    mimetype: string;
    size: number;
    path?: string | null;
  };
}) {
  const originalName = decodeLatin1ToUtf8(args.file.originalname);

  const doc = await contractDocumentRepository.create({
    companyId: args.actor.companyId,
    uploaderId: args.actor.id,
    originalName,
    storedName: args.file.filename,
    mimeType: args.file.mimetype,
    size: args.file.size,
    path: args.file.path ?? null,
  });

  return { contractDocumentId: doc.id };
}
