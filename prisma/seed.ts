import bcrypt from 'bcrypt';

import prisma from '../src/lib/prisma.js';

async function main() {
  // CarModel 테이블에 차종(모델) 데이터 추가
  await prisma.carModel.createMany({
    data: [
      // 기아 차종 데이터
      { model: 'K3', manufacturer: '기아', type: '세단' },
      { model: 'K5', manufacturer: '기아', type: '세단' },
      { model: 'K7', manufacturer: '기아', type: '세단' },
      { model: 'K9', manufacturer: '기아', type: '세단' },
      { model: 'K8', manufacturer: '기아', type: '세단' },
      { model: '모닝', manufacturer: '기아', type: '경차' },
      // 현대 차종 데이터
      { model: '그랜저', manufacturer: '현대', type: '세단' },
      { model: '아반떼', manufacturer: '현대', type: '세단' },
      { model: '소나타', manufacturer: '현대', type: '세단' },
      { model: '투싼', manufacturer: '현대', type: 'SUV' },
      { model: '베뉴', manufacturer: '현대', type: 'SUV' },
      { model: '캐스퍼', manufacturer: '현대', type: '경차' },
    ],
    skipDuplicates: true, // 동일 데이터가 존재하면 추가 안 함
  });

  // 회사 등록
  const company = await prisma.companies.upsert({
    where: { companyCode: 'CDEIT2025' },
    update: {},
    create: {
      companyName: 'Codeit',
      companyCode: 'CDEIT2025',
    },
  });

  // 어드민 계정 비밀번호 해시
  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
  const userHashed = await bcrypt.hash('aaaa1234', 10);

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

  await prisma.users.createMany({
    data: [
      {
        name: '김코드',
        email: 'user1@codeit.com',
        employeeNumber: '101',
        phoneNumber: '01011112222',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '이코드',
        email: 'user2@codeit.com',
        employeeNumber: '102',
        phoneNumber: '01022223333',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '박코드',
        email: 'user3@codeit.com',
        employeeNumber: '103',
        phoneNumber: '01033334444',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '최코드',
        email: 'user4@codeit.com',
        employeeNumber: '104',
        phoneNumber: '01044445555',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '정코드',
        email: 'user5@codeit.com',
        employeeNumber: '105',
        phoneNumber: '01055556666',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
    ],
    skipDuplicates: true, // 이메일 unique면 중복 시 무시
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