// import bcrypt from 'bcrypt';

// import prisma from '../src/config/prisma.js';

// async function main() {
//   // CarModel 테이블에 차종(모델) 데이터 추가
//   await prisma.carModel.createMany({
//     data: [
//       // 기아 차종 데이터
//       { model: 'K3', manufacturer: '기아', type: '세단' },
//       { model: 'K5', manufacturer: '기아', type: '세단' },
//       { model: 'K7', manufacturer: '기아', type: '세단' },
//       { model: 'K9', manufacturer: '기아', type: '세단' },
//       { model: 'K8', manufacturer: '기아', type: '세단' },
//       { model: '모닝', manufacturer: '기아', type: '경차' },
//       // 현대 차종 데이터
//       { model: '그랜저', manufacturer: '현대', type: '세단' },
//       { model: '아반떼', manufacturer: '현대', type: '세단' },
//       { model: '소나타', manufacturer: '현대', type: '세단' },
//       { model: '투싼', manufacturer: '현대', type: 'SUV' },
//       { model: '베뉴', manufacturer: '현대', type: 'SUV' },
//       { model: '캐스퍼', manufacturer: '현대', type: '경차' },
//     ],
//     skipDuplicates: true, // 동일 데이터가 존재하면 추가 안 함
//   });

//   // 회사 등록
//   const company = await prisma.companies.upsert({
//     where: { code: 'CDEIT2025' },
//     update: {},
//     create: {
//       name: 'Codeit',
//       code: 'CDEIT2025',
//     },
//   });

//   // 어드민 계정 비밀번호 해시
//   const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

//   // 어드민 유저 등록
//   await prisma.users.upsert({
//     where: { email: 'admin@codeit.com' },
//     update: {},
//     create: {
//       name: 'Admin User',
//       email: 'admin@codeit.com',
//       employeeNumber: '000',
//       phoneNumber: '01000000000',
//       password: hashedPassword,
//       isAdmin: true,
//       companyId: company.id,
//     },
//   });

//   console.log('✅ Seeding 완료');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
// prisma/seed.ts
import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma.js';
import {
  CarType,
  CarStatus,
  ContractsStatus,
  Gender,
  Region,
} from '@prisma/client';

async function main() {
  // 0) 차종(모델) 시드
  await prisma.carModel.createMany({
    data: [
      // 기아
      { model: 'K3', manufacturer: '기아', type: CarType.세단 },
      { model: 'K5', manufacturer: '기아', type: CarType.세단 },
      { model: 'K7', manufacturer: '기아', type: CarType.세단 },
      { model: 'K9', manufacturer: '기아', type: CarType.세단 },
      { model: 'K8', manufacturer: '기아', type: CarType.세단 },
      { model: '모닝', manufacturer: '기아', type: CarType.경차 },
      // 현대
      { model: '그랜저', manufacturer: '현대', type: CarType.세단 },
      { model: '아반떼', manufacturer: '현대', type: CarType.세단 },
      { model: '소나타', manufacturer: '현대', type: CarType.세단 },
      { model: '투싼', manufacturer: '현대', type: CarType.SUV },
      { model: '베뉴', manufacturer: '현대', type: CarType.SUV },
      { model: '캐스퍼', manufacturer: '현대', type: CarType.경차 },
    ],
    skipDuplicates: true,
  });

  // 1) 회사
  const company = await prisma.companies.upsert({
    where: { companyCode: 'CDEIT2025' },
    update: {},
    create: { companyName: 'Codeit', companyCode: 'CDEIT2025' },
  });

  // 2) 사용자 (관리자 + 직원)
  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);

  const admin = await prisma.users.upsert({
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

  // 계약 등록
  await prisma.contracts.createMany({
    data: [
      {
        contractPrice: 20000000,
        status: 'carInspection',
        resolutionDate: new Date('2024-10-22T09:00:00'),
        carId: 1,
        customerId: 1,
        userId: 1,
      },
      {
        contractPrice: 35000000,
        status: 'carInspection',
        resolutionDate: new Date('2024-11-15T10:00:00'),
        carId: 2,
        customerId: 2,
        userId: 1,
      },
    ],
    skipDuplicates: true,
  });

  // 계약에 대해 Meetings 시드
  await prisma.meetings.create({
    data: {
      date: new Date('2024-10-25T14:00:00'),
      contractId: 1,
    },
  });

  await prisma.meetings.create({
    data: {
      date: new Date('2024-11-20T10:00:00'),
      contractId: 2,
    },
  });

  // 각 미팅에 대해 Alarms 시드
  await prisma.alarms.createMany({
    data: [
      {
        time: new Date('2024-10-25T13:00:00'),
        meetingId: 1,
      },
      {
        time: new Date('2024-11-20T09:30:00'),
        meetingId: 2,
      },
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

  const user = await prisma.users.upsert({
    where: { email: 'user1@codeit.com' },
    update: {},
    create: {
      name: '김직원',
      email: 'user1@codeit.com',
      employeeNumber: 'U-001',
      phoneNumber: '01011112222',
      password: await bcrypt.hash('UserPass123!', 10),
      isAdmin: false,
      companyId: company.id,
    },
  });

  // 3) 고객 2명
  const [cust1, cust2] = await Promise.all([
    prisma.customers.upsert({
      where: { id: 1 }, // 없으면 create가 필요하므로 upsert용 unique가 없으면 findFirst→create로 바꿔도 됨
      update: {},
      create: {
        name: '김고객',
        gender: Gender.MALE,
        phoneNumber: '010-1234-5678',
        ageGroup: 'GENERATION_30',
        region: Region.서울,
        email: 'kim@example.com',
        memo: '시드 데이터',
        companyId: company.id,
      },
    }),
    prisma.customers.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: '홍길동',
        gender: Gender.MALE,
        phoneNumber: '010-2222-3333',
        ageGroup: 'GENERATION_30',
        region: Region.서울,
        email: 'hong@example.com',
        memo: '시드 데이터',
        companyId: company.id,
      },
    }),
  ]);

  // 4) 차종 조회 (그랜저 / K3)
  const [grandeurModel, k3Model] = await Promise.all([
    prisma.carModel.findUnique({
      where: { manufacturer_model: { manufacturer: '현대', model: '그랜저' } },
    }),
    prisma.carModel.findUnique({
      where: { manufacturer_model: { manufacturer: '기아', model: 'K3' } },
    }),
  ]);

  if (!grandeurModel || !k3Model) {
    throw new Error('필요한 CarModel(그랜저/K3)을 찾지 못했습니다.');
  }

  // 5) 차량 2대
  const [car1, car2] = await Promise.all([
    prisma.cars.create({
      data: {
        carNumber: '12가3456',
        manufacturingYear: 2022,
        mileage: 15000,
        price: 28000000,
        accidentCount: 0,
        explanation: '시드 차량 1',
        accidentDetails: '없음',
        status: CarStatus.possession,
        modelId: grandeurModel.id,
      },
    }),
    prisma.cars.create({
      data: {
        carNumber: '34나5678',
        manufacturingYear: 2021,
        mileage: 23000,
        price: 18000000,
        accidentCount: 1,
        explanation: '시드 차량 2',
        accidentDetails: '단순교환 1건',
        status: CarStatus.possession,
        modelId: k3Model.id,
      },
    }),
  ]);

  // 6) 계약 2건 (업로드 테스트용)
  const now = new Date();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [contract1, contract2] = await Promise.all([
    prisma.contracts.create({
      data: {
        date: now,
        contractPrice: 25000000,
        status: ContractsStatus.priceNegotiation,
        resolutionDate: nextWeek,
        carId: car1.id,
        customerId: cust1.id,
        userId: user.id, // 담당자: 직원
      },
      include: {
        customer: true,
        car: { include: { carModel: true } },
      },
    }),
    prisma.contracts.create({
      data: {
        date: now,
        contractPrice: 15000000,
        status: ContractsStatus.carInspection,
        resolutionDate: nextWeek,
        carId: car2.id,
        customerId: cust2.id,
        userId: user.id,
      },
      include: {
        customer: true,
        car: { include: { carModel: true } },
      },
    }),
  ]);

  console.log('✅ Seeding 완료');
  console.log('company:', company.companyName);
  console.log('admin:', admin.email, 'user:', user.email);
  console.log('upload test contractIds →', contract1.id, contract2.id);
  console.log(
    `label1 → ${contract1.car.carModel.model} - ${contract1.customer.name} 고객님`
  );
  console.log(
    `label2 → ${contract2.car.carModel.model} - ${contract2.customer.name} 고객님`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
