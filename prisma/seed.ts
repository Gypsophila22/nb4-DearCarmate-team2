import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 회사 등록
  const company = await prisma.companies.upsert({
    where: { code: 'CDEIT2025' },
    update: {},
    create: {
      name: 'Codeit',
      code: 'CDEIT2025',
    },
  });

  // 어드민 계정 비밀번호 해시
  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

  // 어드민 유저 등록
  await prisma.users.upsert({
    where: { email: 'admin@codeit.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@codeit.com',
      employeeNumber: '000',
      phoneNumber: '01000000000',
      password: hashedPassword,
      isAdmin: true,
      companyId: company.id,
    },
  });

  console.log('✅ Seeding 완료');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
