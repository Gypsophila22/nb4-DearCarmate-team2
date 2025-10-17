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
    where: { code: 'CDEIT2025' },
    update: {},
    create: {
      name: 'Codeit',
      code: 'CDEIT2025',
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

  // 고객 등록
  await prisma.customers.createMany({
    data: [
      {
        name: '고객테스트이름',
        gender: 'MALE',
        phoneNumber: '01012345678',
        ageGroup: 'GENERATION_10',
        region: '서울',
        email: 'test@test.com',
        memo: '고객설명 테스트',
        companyId: company.id,
      },
      {
        name: '고객테스트이름2',
        gender: 'MALE',
        phoneNumber: '01012345678',
        ageGroup: 'GENERATION_10',
        region: '서울',
        email: 'test@test.com',
        memo: '고객설명 테스트',
        companyId: company.id,
      },
    ],
    skipDuplicates: true,
  });

  // 차량 등록
  await prisma.cars.createMany({
    data: [
      {
        carNumber: '12가3456',
        manufacturingYear: 2022,
        mileage: 15000,
        price: 20000000,
        accidentCount: 0,
        explanation: '깨끗한 상태의 중고차',
        accidentDetails: '',
        status: 'possession',
        modelId: 1,
      },
      {
        carNumber: '34나7890',
        manufacturingYear: 2021,
        mileage: 30000,
        price: 18000000,
        accidentCount: 1,
        explanation: '경미한 사고 있음',
        accidentDetails: '뒷범퍼 약간 긁힘',
        status: 'possession',
        modelId: 2,
      },
    ],
    skipDuplicates: true,
  });

  // TODO: id 하드코딩한거 수정해야함
  // 계약 생성
  const contract1 = await prisma.contracts.create({
    data: {
      contractPrice: 20000000,
      status: 'carInspection',
      resolutionDate: new Date('2024-10-22T09:00:00'),
      carId: 1,
      customerId: 1,
      userId: 1,
    },
  });

  const contract2 = await prisma.contracts.create({
    data: {
      contractPrice: 35000000,
      status: 'carInspection',
      resolutionDate: new Date('2024-11-15T10:00:00'),
      carId: 2,
      customerId: 2,
      userId: 1,
    },
  });

  // 계약에 대해 Meetings 시드
  const meeting1 = await prisma.meetings.create({
    data: {
      date: new Date('2024-10-25T14:00:00'),
      contractId: contract1.id, // contract1의 실제 ID
    },
  });

  const meeting2 = await prisma.meetings.create({
    data: {
      date: new Date('2024-11-20T10:00:00'),
      contractId: contract2.id, // contract2의 실제 ID
    },
  });

  // 각 미팅에 대해 Alarms 시드
  await prisma.alarms.createMany({
    data: [
      { time: new Date('2024-10-25T13:00:00'), meetingId: meeting1.id },
      { time: new Date('2024-11-20T09:30:00'), meetingId: meeting2.id },
    ],
    skipDuplicates: true,
  });

  // 계약서 등록
  await prisma.contractDocuments.createMany({
    data: [
      {
        originalName: '계약서_샘플1.pdf',
        storedName: 'contract_sample1_20251016.pdf',
        mimeType: 'application/pdf',
        size: 102400,
        path: '/path/test/contract_sample1_20251016.pdf',
        url: '/url/test/contract_sample1_20251016.pdf',
        contractId: 1,
        uploaderId: 1,
        companyId: 1,
      },
      {
        originalName: '계약서_샘플2.pdf',
        storedName: 'contract_sample2_20251016.pdf',
        mimeType: 'application/pdf',
        size: 204800,
        path: '/path/test/contract_sample2_20251016.pdf',
        url: '/url/test/contract_sample2_20251016.pdf',
        contractId: 2,
        uploaderId: 1,
        companyId: 1,
      },
    ],
    skipDuplicates: true,
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
