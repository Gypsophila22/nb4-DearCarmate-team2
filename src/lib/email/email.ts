import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, MAIL_FROM, MAIL_TO } =
  process.env;

// 테스트용 개인 이메일 > 개인 이메일
if (!EMAIL_SERVICE || !EMAIL_USER || !EMAIL_PASS || !MAIL_TO) {
  throw new Error(
    'ENV가 부족해요: EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, MAIL_TO 확인'
  );
}

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

async function main() {
  await transporter.verify(); // 접속/인증 확인
  const info = await transporter.sendMail({
    from: MAIL_FROM ?? EMAIL_USER,
    to: MAIL_TO, // 쉼표로 여러 명 가능
    subject: 'Nodemailer Test',
    text: '노드 패키지 nodemailer로 보낸 이메일',
    // html: '<b>테스트</b>',
    // attachments: [{ filename: 'contract.pdf', path: '/path/to/contract.pdf' }],
  });
  console.log('Email Sent:', info.messageId);
}

main().catch(console.error);
