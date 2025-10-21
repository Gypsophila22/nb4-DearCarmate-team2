import prisma from '../../lib/prisma.js';
import { sendMail } from '../../lib/email/email.js';
import {
  // buildPublicUrl,
  resolveUploadAbsPath,
  toRelativeFromAbsolute,
} from '../../lib/file-url.js';

/**
 * 새로 연결된 계약 문서들(docIds)에 대해 고객에게 메일 알림을 보낸다.
 * - docIds는 "이번 PATCH에서 새로 연결된" 문서 id만 보내는 것이 이상적.
 * - 내부에서 조인 포함 조회 후 메일을 보낸다.
 */
export async function sendContractDocsLinkedEmail(docIds: number[]) {
  if (!docIds.length) return { mailed: 0 };

  const docs = await prisma.contractDocuments.findMany({
    where: { id: { in: docIds } },
    include: {
      contract: {
        include: {
          customer: true,
          car: { include: { carModel: true } },
        },
      },
    },
  });

  let count = 0;
  for (const doc of docs) {
    const to = doc.contract?.customer?.email;
    if (!to) continue;

    const rel = doc.path ? toRelativeFromAbsolute(doc.path) : null;
    // const url = rel ? buildPublicUrl(rel) : undefined;
    const carLabel = doc.contract?.car
      ? `${doc.contract.car.carModel?.model ?? ''} (${doc.contract.car.carNumber})`.trim()
      : '계약 차량';

    const text = [
      `${doc.contract?.customer?.name ?? '고객님'}, 안녕하세요.`,
      '요청하신 계약서가 업로드되어 계약에 연결되었습니다.',
      `- 차량: ${carLabel}`,
      `- 파일명: ${doc.originalName}`,
      // url ? `- 링크: ${url}` : '',
      '문의 사항이 있으시면 언제든지 회신 부탁드립니다.',
    ]
      .filter(Boolean)
      .join('\n');

    // exactOptionalPropertyTypes 대응: attachments는 조건부로만
    const mail: {
      to: string;
      subject: string;
      text: string;
      attachments?: { filename: string; path: string; contentType?: string }[];
    } = { to, subject: `계약서 업로드 안내: ${carLabel}`, text };

    if (rel) {
      mail.attachments = [
        {
          filename: doc.originalName,
          path: resolveUploadAbsPath(rel),
          contentType: doc.mimeType || 'application/pdf',
        },
      ];
    }

    try {
      await sendMail(mail);
      count += 1;
    } catch (e) {
      console.error('[mail failed]', { docId: doc.id, to }, e);
    }
  }

  return { mailed: count };
}
