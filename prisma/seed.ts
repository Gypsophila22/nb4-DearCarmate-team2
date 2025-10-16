import bcrypt from 'bcrypt';

import prisma from '../src/config/prisma.js';

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

  // 고객(Customers) 데이터 추가
  await prisma.customers.createMany({
    data: [
      { name: '김민준', email: 'minjun.kim@example.com', gender: 'MALE', phoneNumber: '010-1234-5678', region: '서울', ageGroup: '30-40', memo: '첫 번째 고객' },
      { name: '이서연', email: 'seoyeon.lee@example.com', gender: 'FEMALE', phoneNumber: '010-2345-6789', region: '부산', ageGroup: '20-30', memo: '두 번째 고객' },
      { name: '박지훈', email: 'jihoon.park@example.com', gender: 'MALE', phoneNumber: '010-3456-7890', region: '인천', ageGroup: '40-50', memo: '세 번째 고객' },
      { name: '최수아', email: 'sua.choi@example.com', gender: 'FEMALE', phoneNumber: '010-4567-8901', region: '대구', ageGroup: '20-30', memo: '네 번째 고객' },
      { name: '정도윤', email: 'doyoon.jung@example.com', gender: 'MALE', phoneNumber: '010-5678-9012', region: '광주', ageGroup: '30-40', memo: '다섯 번째 고객' },
      { name: '윤채원', email: 'chaewon@example.com', gender: 'FEMALE', phoneNumber: '010-6789-0123', region: '대전', ageGroup: '20-30', memo: 'VIP 고객' },
      { name: '임도현', email: 'dohyun@example.com', gender: 'MALE', phoneNumber: '010-7890-1234', region: '울산', ageGroup: '50-60', memo: '재방문 고객' },
      { name: '백하윤', email: 'hayoon@example.com', gender: 'FEMALE', phoneNumber: '010-8901-2345', region: '수원', ageGroup: '30-40', memo: '신규 상담' },
      { name: '송은우', email: 'eunwoo@example.com', gender: 'MALE', phoneNumber: '010-9012-3456', region: '울산', ageGroup: '40-50', memo: '소개 고객' },
      { name: '안지아', email: 'jia@example.com', gender: 'FEMALE', phoneNumber: '010-0123-4567', region: '고양', ageGroup: '20-30', memo: '온라인 문의' },
      { name: '정시우', email: 'siwoo@example.com', gender: 'MALE', phoneNumber: '010-1122-3344', region: '서울', ageGroup: '30-40', memo: '장기 고객' },
      { name: '오서아', email: 'seoa@example.com', gender: 'FEMALE', phoneNumber: '010-2233-4455', region: '부산', ageGroup: '40-50', memo: '차량 교체 문의' },
      { name: '강이준', email: 'ijun@example.com', gender: 'MALE', phoneNumber: '010-3344-5566', region: '용인', ageGroup: '20-30', memo: '첫차 구매' },
      { name: '신지유', email: 'jiyoo@example.com', gender: 'FEMALE', phoneNumber: '010-4455-6677', region: '성남', ageGroup: '50-60', memo: '가족 차량 문의' },
      { name: '한예준', email: 'yejun@example.com', gender: 'MALE', phoneNumber: '010-5566-7788', region: '부산', ageGroup: '30-40', memo: '견적 문의' }
    ],
    skipDuplicates: true, // email이 중복되면 추가X
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
