import nodemailer from 'nodemailer';

const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, MAIL_FROM } = process.env;

// 테스트용 개인 이메일 > 개인 이메일
if (!EMAIL_SERVICE || !EMAIL_USER || !EMAIL_PASS) {
  throw new Error('ENV가 부족해요: EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS 확인');
}

// transporter는 싱글턴으로 재사용
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
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
  return transporter.sendMail({ from, ...opts });
}
