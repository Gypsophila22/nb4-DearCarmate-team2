import nodemailer from 'nodemailer';

const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, MAIL_FROM } = process.env;

// transporter는 싱글턴으로 재사용
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE, // 'gmail' 등
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  pool: true, // ✅ 연결 풀링
  maxConnections: 3, // 동시에 유지할 SMTP 연결 수
  maxMessages: 200, // 연결당 전송 가능한 메시지 수
  rateDelta: 1000, // 윈도우(ms)
  rateLimit: 10, // 초당 최대 전송 수
});

export async function verifyMailer() {
  return transporter.verify();
}

type Attachment = { filename: string; path: string; contentType?: string };

export async function sendMail(opts: {
  to: string; // 다수면 "a@x.com,b@y.com"
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
  from?: string; // 미지정 시 MAIL_FROM/EMAIL_USER 사용
}) {
  const from = opts.from ?? MAIL_FROM ?? EMAIL_USER!;
  // const t0 = Date.now();
  const info = await transporter.sendMail({ from, ...opts });
  // const ms = Date.now() - t0;

  // console.log('[mail:sent]', {
  //   to: opts.to,
  //   subject: opts.subject,
  //   ms,
  //   accepted: info.accepted,
  //   rejected: info.rejected,
  // });

  return info;
}
