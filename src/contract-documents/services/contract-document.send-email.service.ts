// import prisma from '../../lib/prisma.js';
// import { sendMail } from '../../lib/email/email.js';
// import { buildPublicUrl } from '../../lib/file-url.js';

// /**
//  * 새로 연결된 계약 문서들(docIds)에 대해 고객에게 메일 알림을 보낸다.
//  * - docIds는 "이번 PATCH에서 새로 연결된" 문서 id만 보내는 것이 이상적.
//  * - 내부에서 조인 포함 조회 후 메일을 보낸다.
//  */
// export async function sendContractDocsLinkedEmail(docIds: number[]) {
//   if (!docIds.length) return { mailed: 0 };

//   const docs = await prisma.contractDocuments.findMany({
//     where: { id: { in: docIds }, contractId: { not: null } },
//     include: {
//       contract: {
//         include: {
//           customer: true,
//           car: { include: { carModel: true } },
//         },
//       },
//     },
//   });

//   for (const doc of docs) {
//     if (!doc.contract) continue;
//     const to = doc.contract.customer?.email;
//     if (!to) continue;

//     const rel = doc.path ?? null;
//     const publicUrl = rel ? buildPublicUrl(rel) : undefined;

//     const carLabel = doc.contract.car
//       ? `${doc.contract.car.carModel?.model ?? ''} (${doc.contract.car.carNumber})`.trim()
//       : '계약 차량';

//     const text = [
//       `${doc.contract.customer?.name ?? '고객님'} 님, 안녕하세요.`,
//       '요청하신 계약서가 업로드되어 계약에 연결되었습니다.',
//       `- 차량: ${carLabel}`,
//       `- 파일명: ${doc.originalName}`,
//       publicUrl ? `- 링크: ${publicUrl}` : '', // 링크만 제공
//       '',
//       '문의 사항이 있으시면 언제든지 회신 부탁드립니다.',
//     ]
//       .filter(Boolean)
//       .join('\n');

//     const mail = {
//       to,
//       subject: `계약서 업로드 안내: ${carLabel}`,
//       text, // 텍스트 본문에 공개 URL 넣기
//     };

//     try {
//       await sendMail(mail);
//     } catch (e) {
//       console.error('[mail failed]', { docId: doc.id, to }, e);
//     }
//   }
// }

import { Resend } from 'resend';
import { buildPublicUrl } from '../../lib/file-url.js';
import prisma from '../../lib/prisma.js';
import { config } from '../../lib/config.js';
import path from 'path';

let _resend: Resend | null = null;
/** Lazy 생성으로 env 로딩 순서 문제 방지 */
function getResend() {
  if (_resend) return _resend;
  if (config.EMAIL_PROVIDER !== 'resend') {
    throw new Error('EMAIL_PROVIDER is not "resend"');
  }
  _resend = new Resend(config.RESEND_API_KEY);
  return _resend;
}

/** 이메일 발송용 타입 */
type NewlyLinkedItem = {
  email?: string;
  files: {
    name?: string;
    relativePath?: string;
    urlOrKey?: string;
    url?: string;
  }[];
  subject?: string;
  introText?: string;
};

/** 계약 문서 id[]로 이메일 전송용 데이터 매핑 */
export async function idsToItems(ids: number[]): Promise<NewlyLinkedItem[]> {
  const rows = await prisma.contractDocuments.findMany({
    where: { id: { in: ids } },
    select: {
      originalName: true,
      path: true,
      contract: {
        select: {
          customer: {
            select: { email: true },
          },
        },
      },
    },
  });

  return rows.map(
    (r): NewlyLinkedItem => ({
      email: r.contract?.customer?.email ?? process.env.MAIL_TO,
      files: [{ name: r.originalName, relativePath: r.path }],
      subject: '계약서가 연결되었습니다',
      introText: '아래 링크에서 문서를 확인하세요.',
    }),
  );
}

/** 실제 메일 발송 로직 */
export async function sendContractDocsLinkedEmail(
  input: NewlyLinkedItem[] | number[],
): Promise<void> {
  const resend = getResend();

  // 1) 입력 정규화
  const items: NewlyLinkedItem[] =
    typeof input[0] === 'number'
      ? await idsToItems(input as number[])
      : (input as NewlyLinkedItem[]);

  // 2) 수신자별로 파일 모으기
  const byRecipient = new Map<
    string,
    { files: { url: string; label: string }[]; introText?: string }
  >();

  for (const item of items) {
    const to = item.email ?? process.env.MAIL_TO!;
    if (!to) continue;

    const acc = byRecipient.get(to) ?? { files: [], introText: item.introText };
    for (const f of item.files) {
      const rel = f.relativePath ?? f.urlOrKey;
      const url =
        f.url ??
        (rel
          ? rel.startsWith('http')
            ? rel
            : buildPublicUrl(rel)
          : undefined);
      if (!url) continue;
      const label = f.name ?? path.basename(url);
      acc.files.push({ url, label });
    }
    byRecipient.set(to, acc);
  }

  // 3) 수신자별로 한 통씩 발송
  for (const [to, { files, introText }] of byRecipient) {
    if (files.length === 0) continue;

    const subject =
      files.length === 1
        ? `계약서 확인: ${files[0].label}`
        : `계약서 ${files.length}건이 연결되었습니다`;

    const intro = introText ?? '아래 링크에서 문서를 확인하세요.';

    const listHtml = files
      .map(
        (l) => `
          <li style="margin:6px 0">
            <a href="${l.url}" target="_blank" rel="noopener"
               style="color:#2563eb;text-decoration:none;font-weight:600">
              ${l.label}
            </a>
          </li>`,
      )
      .join('');

    const html = `
      <div style="font-family:system-ui,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6">
        <p>${intro}</p>
        <ul style="padding-left:20px;margin:12px 0">${listHtml}</ul>
        <p style="color:#6b7280;font-size:12px">본 메일은 발신 전용입니다.</p>
      </div>
    `;

    const text = [intro, ...files.map((l) => `${l.label}\n${l.url}`)].join(
      '\n\n',
    );

    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM!, // 프로덕션: 인증 도메인 or onboarding@resend.dev
      to,
      subject,
      html,
      text,
    });
    if (error) throw error;
  }
}
