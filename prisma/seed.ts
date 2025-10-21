import bcrypt from 'bcrypt';
import {
  PrismaClient,
  CarStatus,
  ContractsStatus,
  Prisma,
} from '@prisma/client';

const prisma = new PrismaClient();

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

  // 회사 등록 (Codeit만 변수로 받아두고 나머지는 반복문)
  const company = await prisma.companies.upsert({
    where: { companyCode: 'CODEIT2025' },
    update: {},
    create: { companyName: 'Codeit', companyCode: 'CODEIT2025' },
  });

  // 나머지 회사 등록
  const otherCompanies = [
    { companyName: '햇살카', companyCode: 'Sunshine' },
    { companyName: '케이카', companyCode: 'KCar' },
    { companyName: '굿모닝카', companyCode: 'GoodMorning' },
    { companyName: '행복카', companyCode: 'Happy' },
    { companyName: '믿음카', companyCode: 'Trust' },
    { companyName: '신뢰카', companyCode: 'reliable' },
    { companyName: '우리카', companyCode: 'OurCar' },
    { companyName: '미래카', companyCode: 'Future' },
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
        phoneNumber: '010-1111-2222',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '이코드',
        email: 'user2@codeit.com',
        employeeNumber: '102',
        phoneNumber: '010-2222-3333',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '박코드',
        email: 'user3@codeit.com',
        employeeNumber: '103',
        phoneNumber: '010-3333-4444',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '최코드',
        email: 'user4@codeit.com',
        employeeNumber: '104',
        phoneNumber: '010-4444-5555',
        password: userHashed,
        isAdmin: false,
        companyId: company.id,
      },
      {
        name: '정코드',
        email: 'user5@codeit.com',
        employeeNumber: '105',
        phoneNumber: '010-5555-6666',
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
  const carModels = await prisma.carModel.findMany({
    select: { id: true, manufacturer: true, model: true },
  });

  const getModelId = (
    manufacturer: string,
    model: string,
  ): number | undefined => {
    return carModels.find(
      (m) => m.manufacturer === manufacturer && m.model === model,
    )?.id;
  };

  // 2) 차량 원본 정의
  const carsSeedRaw = [
    {
      carNumber: '12가 3456',
      manufacturer: '현대',
      model: '투싼',
      manufacturingYear: 2021,
      mileage: 32000,
      price: 1950,
      accidentCount: 0,
      explanation: '무사고, 1인 소유',
      accidentDetails: '',
      status: CarStatus.possession,
    },
    {
      carNumber: '34나 7890',
      manufacturer: '기아',
      model: 'K5',
      manufacturingYear: 2020,
      mileage: 45000,
      price: 1850,
      accidentCount: 1,
      explanation: '경미 사고 1회(후범퍼 교체)',
      accidentDetails: '후범퍼 단순 교체',
      status: CarStatus.possession,
    },
    {
      carNumber: '56다 1122',
      manufacturer: '현대',
      model: '그랜저',
      manufacturingYear: 2019,
      mileage: 68000,
      price: 2150,
      accidentCount: 0,
      explanation: '정비이력 양호',
      accidentDetails: '',
      status: CarStatus.possession,
    },
    {
      carNumber: '78라 3344',
      manufacturer: '기아',
      model: '모닝',
      manufacturingYear: 2022,
      mileage: 18000,
      price: 950,
      accidentCount: 0,
      explanation: '세컨드카, 주행거리 짧음',
      accidentDetails: '',
      status: CarStatus.possession,
    },
    {
      carNumber: '90마 5566',
      manufacturer: '현대',
      model: '베뉴',
      manufacturingYear: 2021,
      mileage: 24000,
      price: 1650,
      accidentCount: 0,
      explanation: '경정비 완료',
      accidentDetails: '',
      status: CarStatus.possession,
    },
  ] as const;

  // 3) CarsCreateManyInput로 매핑
  const carsToCreate: Prisma.CarsCreateManyInput[] = [];
  for (const c of carsSeedRaw) {
    const modelId = getModelId(c.manufacturer, c.model);
    if (!modelId) {
      console.warn(`[seed] 모델 없음 -> skip: ${c.manufacturer} ${c.model}`);
      continue;
    }
    carsToCreate.push({
      carNumber: c.carNumber,
      manufacturingYear: c.manufacturingYear,
      mileage: c.mileage,
      price: c.price,
      accidentCount: c.accidentCount,
      explanation: c.explanation,
      accidentDetails: c.accidentDetails,
      status: c.status, // CarStatus enum
      modelId,
    });
  }

  if (carsToCreate.length) {
    await prisma.cars.createMany({ data: carsToCreate, skipDuplicates: true });
  }

  // 4) 계약 5건: 참조 로드(명시 타입 + 길이 체크)
  const createdCars = await prisma.cars.findMany({
    where: { carNumber: { in: carsSeedRaw.map((c) => c.carNumber) } },
    orderBy: { id: 'asc' },
  });
  const usersForCompany = await prisma.users.findMany({
    where: { companyId: company.id },
    orderBy: { id: 'asc' },
  });
  const someCustomers = await prisma.customers.findMany({
    where: { companyId: company.id },
    orderBy: { id: 'asc' },
  });

  if (!createdCars.length || !usersForCompany.length || !someCustomers.length) {
    console.warn('[seed] 계약 생성 생략: 참조 데이터 부족');
  } else {
    const admin = usersForCompany.find((u) => u.isAdmin) ?? usersForCompany[0];

    // 만들 수 있는 최소 개수만큼만 생성(최대 5건)
    const n = Math.min(
      5,
      createdCars.length,
      someCustomers.length,
      usersForCompany.length,
    );

    const statuses: ContractsStatus[] = [
      ContractsStatus.carInspection,
      ContractsStatus.priceNegotiation,
      ContractsStatus.contractDraft,
      ContractsStatus.contractSuccessful,
      ContractsStatus.contractFailed,
    ];

    const today = new Date();
    const addDays = (d: number) => new Date(today.getTime() + d * 86400000);

    const contractsToCreate: Prisma.ContractsCreateManyInput[] = [];
    for (let i = 0; i < n; i++) {
      const car = createdCars[i];
      const customer = someCustomers[i];
      const user = usersForCompany[i] ?? admin;

      // 모든 키가 확실히 존재할 때만 push (undefined 제거)
      if (car?.id && customer?.id && user?.id) {
        contractsToCreate.push({
          carId: car.id,
          customerId: customer.id,
          userId: user.id,
          contractPrice: [1900, 1800, 2100, 900, 1600][i] ?? 1500,
          status: statuses[i] ?? ContractsStatus.carInspection,
          date: addDays([-3, -2, -1, -10, -8][i] ?? -1),
          resolutionDate: addDays([7, 5, 3, -2, -1][i] ?? 7),
        });
      }
    }

    if (contractsToCreate.length) {
      await prisma.contracts.createMany({
        data: contractsToCreate,
        skipDuplicates: true,
      });

      // 계약된 차량 상태 업데이트
      const progressingIds = contractsToCreate.slice(0, 2).map((c) => c.carId);
      await prisma.cars.updateMany({
        where: { id: { in: progressingIds } },
        data: { status: CarStatus.contractProceeding },
      });
    }
  }

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
