# 🚗 Dear CarMate - TEAM2

> **자동차 판매 관리 통합 백오피스 시스템**  
> 계약, 차량, 고객, 기업, 유저, 계약서 관리 등  
> 모든 거래 과정을 효율적으로 관리할 수 있는 기업용 웹 서비스입니다.

---

## 📆 프로젝트 개요

- **프로젝트 기간:** 2025.09.30 ~ 2025.10.29
- **프로젝트 주제:** 프로그래밍 교육 사이트의 백엔드 시스템 구축
- **목표:** Express + Prisma 기반의 RESTful API 서버 구현
- **Repository:** [GitHub 링크](https://github.com/Gypsophila22/nb4-DearCarmate-team2)

---

## 🧑‍🤝‍🧑 팀 구성

| 이름       | 역할                   | 담당 기능                            | GitHub                                          |
| ---------- | ---------------------- | ------------------------------------ | ----------------------------------------------- |
| **심하원** | Backend Developer      | 인증 / 유저 관리, 계약서 업로드 모듈 | [Gypsophila22](https://github.com/Gypsophila22) |
| **길도현** | PM / Backend Developer | 프로젝트 관리, 코드 리뷰, 일정 조율  | [DoHyunGil](https://github.com/DoHyunGil)       |
| **김보경** | Backend Developer      | 차량, 계약 관리 기능                 | [bgk614](https://github.com/bgk614)             |
| **이서진** | Backend Developer      | 기업 관리, 대시보드 구현             | [morunero211](https://github.com/morunero211)   |
| **이제창** | Backend Developer      | 고객 관리, 배포                      | [Jerang2](https://github.com/Jerang2)           |

---

## ⚙️ 기술 스택

| 분야                | 사용 기술                      |
| ------------------- | ------------------------------ |
| **Backend**         | Node.js, Express.js            |
| **ORM**             | Prisma ORM                     |
| **Database**        | PostgreSQL                     |
| **Authentication**  | Passport (JWT, Local Strategy) |
| **Validation**      | Zod                            |
| **Email Service**   | Nodemailer                     |
| **File Upload**     | Multer                         |
| **Infra / Tooling** | Git, GitHub, Discord, VSCode   |
| **Deploy**          | Render / Vercel                |

---

## 🧱 프로젝트 구조

<details>
<summary>📂 폴더 구조 보기</summary>

```
./src
├── app.ts
├── auth
│   ├── config/
│   ├── controllers/
│   ├── repositories/
│   ├── schemas/
│   └── services/
├── cars/
├── companies/
├── contract-documents/
├── contracts/
├── customers/
├── dashboard/
├── enums/
├── lib/
├── middlewares/
├── routers/
└── users/
```

</details>

---

## 🔑 주요 기능

### 🔐 인증 (Auth)

- 이메일 & 비밀번호 기반 로그인
- JWT 인증 토큰 기반 세션 유지
- 로그아웃은 프론트엔드에서 처리

### 🧭 어드민 (Admin)

- **어드민 전용 페이지 접근 제한**
- 기업 등록 / 수정 / 삭제
- 기업별 유저 목록 조회
- 유저 강제 탈퇴 가능

---

## 👤 유저 관리

- **회원가입**
  - 이름, 이메일, 사원번호, 연락처, 기업명, 인증코드 입력
  - 기업명 & 인증코드 검증을 통과해야 가입 성공
- **개인정보 수정**
  - 비밀번호 재입력으로 2차 인증
  - 사원번호, 연락처, 비밀번호 수정 가능

---

## 🚘 차량 관리

- **등록**
  - 차량번호, 제조사, 차종, 제조년도, 주행거리, 가격, 사고이력 등 입력
  - 선택 입력: 차량 설명, 사고 상세
- **수정 / 삭제**
  - 유저 소속 기업 차량만 수정 및 삭제 가능
- **목록 조회**
  - 차량번호, 제조사, 차종, 주행거리, 가격, 상태 표시
  - 페이지네이션, 차량번호/차종 검색 지원
- **대용량 등록 (CSV 업로드)**
  - csv 파일로 차량 정보 일괄 등록

---

## 🧾 고객 관리

- **등록**
  - 고객명, 성별, 연락처, 연령대, 지역, 이메일, 메모 입력
- **수정 / 삭제**
  - 회사 내 등록된 고객만 관리 가능
- **목록 조회**
  - 고객명, 계약횟수, 연락처 등 표시
  - 페이지네이션 / 고객명 / 이메일 검색 지원
- **대용량 업로드**
  - CSV 파일로 대량 고객 등록 가능

---

## 📄 계약 관리

- **등록**
  - 차량, 고객, 미팅 일정(최대 3개) 입력
- **수정 / 삭제**
  - 회사 소속 계약만 관리 가능
- **목록 조회 (칸반 보드 형태)**
  - 상태별(차량 확인 / 가격 협의 / 계약 성공 / 계약 실패) 표시
  - 드래그앤드랍으로 상태 변경
  - 고객명 / 담당자 검색 가능

---

## 📊 대시보드

- 월 매출, 진행 계약 수, 계약 성공 건수 표시
- 차량 타입별 계약 수 및 매출액 시각화
- 회사별 실적 통계 제공

---

## 📑 계약서 관리

- **업로드**
  - 계약별 PDF / 이미지 파일 업로드 가능
  - 확장자 및 용량 제한
  - 업로드 시 고객에게 자동 이메일 발송 (첨부 포함)
- **수정**
  - 계약서 일부 삭제 / 추가 등록 가능
- **다운로드**
  - 계약서 일부 또는 전체 다운로드
- **목록 조회**
  - 계약서명, 체결일, 문서 수, 담당자, 차량번호 표시
  - 검색 및 페이지네이션 지원

---

## 📂 대용량 업로드

- CSV 파일 업로드로 고객 / 차량 데이터 대량 등록
- 파일 유효성 검사 및 실패 항목 로그 제공

---

## 🌐 배포 및 실행

### 0) 환경 변수

`.env.sample`을 복사해 실제 값을 채웁니다.

```bash
cp .env.sample .env
```

### 1) 의존성 설치

```bash
npm install
```

### 2) Prisma 초기화 (최초 1회 혹은 스키마 변경 시)

> ※ 현재 package.json 스크립트에 자동 훅이 없으므로 수동 실행합니다.

```bash
# Prisma Client 생성
npx prisma generate --schema=./prisma/schema.prisma

# 개발 DB에 마이그레이션 적용(로컬 개발용)
npx prisma migrate dev --schema=./prisma/schema.prisma

# (선택) 시드 데이터 넣기
npx tsx prisma/seed.ts
```

### 3) 로컬 개발 서버

```bash
npm run dev
```

### 4) 프로덕션 빌드 & 실행

> 배포 환경(서버/컨테이너)에서는 `migrate deploy`를 권장합니다.

```bash
# (배포 DB에 마이그레이션 적용)
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Prisma Client 재생성(스키마 변경 시)
npx prisma generate --schema=./prisma/schema.prisma

# TypeScript 빌드
npm run build

# 앱 실행 (빌드 산출물: dist/app.js)
npm start
```

### 참고

- `npm run build`는 TypeScript 컴파일만 수행합니다. (Prisma generate/migrate는 **수동** 실행)
- `npm start`는 `dist/app.js`를 실행합니다. `tsconfig.json`의 `outDir`이 `dist`로 설정되어 있어야 합니다.
- 시드 실행은 `npx tsx prisma/seed.ts` 또는 `npm run prisma:seed`(동일)로 가능합니다.

---

## 🧩 환경 변수 (.env)

```env
# ========================
# Database
# ========================
# PostgreSQL 연결 문자열
# 실제 접속 계정/비밀번호/주소/DB 이름에 맞게 바꿔주세요.
DATABASE_URL="postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"

# ========================
# Server
# ========================
# 서버가 실행될 포트 번호
PORT=4000

# ========================
# Authentication
# ========================
# JWT 서명용 시크릿 키 (랜덤 문자열로 변경 필요)
ACCESS_TOKEN_SECRET="changeme_access_secret"
REFRESH_TOKEN_SECRET="changeme_refresh_secret"

# ========================
# email 발송 관련
# ========================
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASS=<앱 비밀번호>   # 2FA 켠 뒤 발급
MAIL_FROM=your@gmail.com

# ========================
# CORS
# ========================
CORS_ORIGIN="https://app.example.com"
```

---

## 📈 ERD (예시)

```
Companies ───< Users ───< Contracts ───< ContractDocuments
                     │              │
                     │              └──< Customers
                     └──< Cars
```

---

## 🧠 프로젝트 회고 & 발표 자료

- **프로젝트 발표자료:** [[Notion 링크](https://www.notion.so/gypsophila1120/2-2990d1a44e938003a54fece4c1364070?source=copy_link)]
- **팀 회고:**
  - 역할 분담 및 브랜치 전략으로 협업 효율 상승
  - Prisma 기반의 타입 안정성 및 개발 생산성 향상
  - Multer + Nodemailer 조합으로 파일 및 이메일 처리 완성

---

## 💬 구현 홈페이지

> [https://www.codeit.kr/](https://www.codeit.kr/)
