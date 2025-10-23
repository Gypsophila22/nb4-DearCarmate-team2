import prisma from '../../lib/prisma.js';
import { sendMail } from '../../lib/email/email.js';
import { buildPublicUrl } from '../../lib/file-url.js';

/**
 * 새로 연결된 계약 문서들(docIds)에 대해 고객에게 메일 알림을 보낸다.
 * - docIds는 "이번 PATCH에서 새로 연결된" 문서 id만 보내는 것이 이상적.
 * - 내부에서 조인 포함 조회 후 메일을 보낸다.
 */
export async function sendContractDocsLinkedEmail(docIds: number[]) {
  if (!docIds.length) return { mailed: 0 };

  const docs = await prisma.contractDocuments.findMany({
    where: { id: { in: docIds }, contractId: { not: null } },
    include: {
      contract: {
        include: {
          customer: true,
          car: { include: { carModel: true } },
        },
      },
    },
  });

  for (const doc of docs) {
    if (!doc.contract) continue;
    const to = doc.contract.customer?.email;
    if (!to) continue;

    const rel = doc.path ?? null;
    const publicUrl = rel ? buildPublicUrl(rel) : undefined;

    const carLabel = doc.contract.car
      ? `${doc.contract.car.carModel?.model ?? ''} (${doc.contract.car.carNumber})`.trim()
      : '계약 차량';

    const text = [
      `${doc.contract.customer?.name ?? '고객님'} 님, 안녕하세요.`,
      '요청하신 계약서가 업로드되어 계약에 연결되었습니다.',
      `- 차량: ${carLabel}`,
      `- 파일명: ${doc.originalName}`,
      publicUrl ? `- 링크: ${publicUrl}` : '', // 링크만 제공
      '',
      '문의 사항이 있으시면 언제든지 회신 부탁드립니다.',
    ]
      .filter(Boolean)
      .join('\n');

    const mail = {
      to,
      subject: `계약서 업로드 안내: ${carLabel}`,
      text, // 텍스트 본문에 공개 URL 넣기
    };

    try {
      await sendMail(mail);
    } catch (e) {
      console.error('[mail failed]', { docId: doc.id, to }, e);
    }
  }
}
