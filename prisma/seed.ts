// import bcrypt from 'bcrypt';

<<<<<<< HEAD
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
=======
import prisma from '../src/lib/prisma.js';
>>>>>>> develop

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

<<<<<<< HEAD
  // 1) 회사
=======
  // 회사 등록 (Codeit만 변수로 받아두고 나머지는 반복문)
>>>>>>> develop
  const company = await prisma.companies.upsert({
    where: { companyCode: 'CDEIT2025' },
    update: {},
    create: { companyName: 'Codeit', companyCode: 'CDEIT2025' },
  });

<<<<<<< HEAD
  // 2) 사용자 (관리자 + 직원)
=======
  // 나머지 회사 등록
  const otherCompanies = [
    { companyName: '햇살카', companyCode: 'sunshine' },
    { companyName: '케이카', companyCode: 'kcar' },
    { companyName: '굿모닝카', companyCode: 'goodmorning' },
    { companyName: '행복카', companyCode: 'happy' },
    { companyName: '믿음카', companyCode: 'trust' },
    { companyName: '신뢰카', companyCode: 'reliable' },
    { companyName: '우리카', companyCode: 'ourcar' },
    { companyName: '미래카', companyCode: 'future' },
  ];

  for (const c of otherCompanies) {
    await prisma.companies.upsert({
      where: { companyCode: c.companyCode },
      update: {},
      create: {
        companyName: c.companyName,
        companyCode: c.companyCode,
      },
    });
  }

  // 어드민 계정 비밀번호 해시
>>>>>>> develop
  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
  const userHashed = await bcrypt.hash('aaaa1234', 10);

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

<<<<<<< HEAD
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
=======
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

  // 고객(Customers) 데이터 추가
  await prisma.customers.createMany({
    data: [
      {
        name: '김민준',
        email: 'minjun.kim@example.com',
        gender: 'male',
        phoneNumber: '010-1234-5678',
        region: '서울',
        ageGroup: 'GENERATION_30',
        memo: '첫 번째 고객',
        contractCount: 2,
        companyId: company.id,
      },
      {
        name: '이서연',
        email: 'seoyeon.lee@example.com',
        gender: 'female',
        phoneNumber: '010-2345-6789',
        region: '부산',
        ageGroup: 'GENERATION_20',
        memo: '두 번째 고객',
        contractCount: 1,
        companyId: company.id,
      },
      {
        name: '박지훈',
        email: 'jihoon.park@example.com',
        gender: 'male',
        phoneNumber: '010-3456-7890',
        region: '인천',
        ageGroup: 'GENERATION_40',
        memo: '세 번째 고객',
        contractCount: 3,
        companyId: company.id,
      },
      {
        name: '최수아',
        email: 'sua.choi@example.com',
        gender: 'female',
        phoneNumber: '010-4567-8901',
        region: '대구',
        ageGroup: 'GENERATION_20',
        memo: '네 번째 고객',
        contractCount: 0,
        companyId: company.id,
      },
      {
        name: '정도윤',
        email: 'doyoon.jung@example.com',
        gender: 'male',
        phoneNumber: '010-5678-9012',
        region: '광주',
        ageGroup: 'GENERATION_30',
        memo: '다섯 번째 고객',
        contractCount: 1,
        companyId: company.id,
      },
      {
        name: '윤채원',
        email: 'chaewon@example.com',
        gender: 'female',
        phoneNumber: '010-6789-0123',
        region: '대전',
        ageGroup: 'GENERATION_20',
        memo: 'VIP 고객',
        contractCount: 5,
        companyId: company.id,
      },
      {
        name: '임도현',
        email: 'dohyun@example.com',
        gender: 'male',
        phoneNumber: '010-7890-1234',
        region: '울산',
        ageGroup: 'GENERATION_50',
        memo: '재방문 고객',
        contractCount: 2,
        companyId: company.id,
      },
      {
        name: '백하윤',
        email: 'hayoon@example.com',
        gender: 'female',
        phoneNumber: '010-8901-2345',
        region: '강원',
        ageGroup: 'GENERATION_30',
        memo: '신규 상담',
        contractCount: 0,
        companyId: company.id,
      },
      {
        name: '송은우',
        email: 'eunwoo@example.com',
        gender: 'male',
        phoneNumber: '010-9012-3456',
        region: '울산',
        ageGroup: 'GENERATION_40',
        memo: '소개 고객',
        contractCount: 1,
        companyId: company.id,
      },
      {
        name: '안지아',
        email: 'jia@example.com',
        gender: 'female',
        phoneNumber: '010-0123-4567',
        region: '경기',
        ageGroup: 'GENERATION_20',
        memo: '온라인 문의',
        contractCount: 0,
        companyId: company.id,
      },
      {
        name: '정시우',
        email: 'siwoo@example.com',
        gender: 'male',
        phoneNumber: '010-1122-3344',
        region: '서울',
        ageGroup: 'GENERATION_30',
        memo: '장기 고객',
        contractCount: 7,
        companyId: company.id,
      },
      {
        name: '오서아',
        email: 'seoa@example.com',
        gender: 'female',
        phoneNumber: '010-2233-4455',
        region: '부산',
        ageGroup: 'GENERATION_40',
        memo: '차량 교체 문의',
        contractCount: 2,
        companyId: company.id,
      },
      {
        name: '강이준',
        email: 'ijun@example.com',
        gender: 'male',
        phoneNumber: '010-3344-5566',
        region: '경남',
        ageGroup: 'GENERATION_20',
        memo: '첫차 구매',
        contractCount: 1,
        companyId: company.id,
      },
      {
        name: '신지유',
        email: 'jiyoo@example.com',
        gender: 'female',
        phoneNumber: '010-4455-6677',
        region: '제주',
        ageGroup: 'GENERATION_50',
        memo: '가족 차량 문의',
        contractCount: 3,
        companyId: company.id,
      },
      {
        name: '한예준',
        email: 'yejun@example.com',
        gender: 'male',
        phoneNumber: '010-5566-7788',
        region: '부산',
        ageGroup: 'GENERATION_30',
        memo: '견적 문의',
        contractCount: 0,
        companyId: company.id,
      },
    ],
    skipDuplicates: true, // email이 중복되면 추가X
  });

  // 회사 데이터 임시 추가.
  const companies = [
    { companyName: '햇살카', companyCode: 'sunshine' },
    { companyName: '케이카', companyCode: 'kcar' },
    { companyName: '굿모닝카', companyCode: 'goodmorning' },
    { companyName: '행복카', companyCode: 'happy' },
    { companyName: '믿음카', companyCode: 'trust' },
    { companyName: '신뢰카', companyCode: 'reliable' },
    { companyName: '우리카', companyCode: 'ourcar' },
    { companyName: '미래카', companyCode: 'future' },
  ];
>>>>>>> develop

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
