# Dear CarMate - TEAM2

### 프로젝트 깃허브 주소

https://github.com/Gypsophila22/nb4-DearCarmate-team2

### 팀원 구성

심하원 (개인 Github 링크)
길도현 (개인 Github 링크)
김보경 (개인 Github 링크)
이서진 (개인 Github 링크)
이제창 (개인 Github 링크)

### 프로젝트 소개

프로그래밍 교육 사이트의 백엔드 시스템 구축
프로젝트 기간: 2025.09.30 ~ 2025.10.29
기술 스택
Backend: Express.js, PrismaORM
Database: PostgreSQL
공통 Tool: Git & Github, Discord

### 팀원별 구현 기능 상세

###

###

###

###

###

### 파일 구조

```
./src
├── app.ts
├── auth
│   ├── config
│   │   └── token.const.ts
│   ├── controllers
│   │   └── auth.controller.ts
│   ├── repositories
│   │   └── auth.repository.ts
│   ├── schemas
│   │   └── auth.schema.ts
│   └── services
│       ├── auth.login.service.ts
│       ├── auth.token.service.ts
│       └── index.ts
├── cars
│   ├── controllers
│   │   └── car.controller.ts
│   ├── repositories
│   │   ├── car.repository.ts
│   │   └── types
│   ├── schemas
│   │   └── car.schema.ts
│   ├── services
│   │   ├── car.create.service.ts
│   │   ├── car.delete.service.ts
│   │   ├── car.get-by-id.service.ts
│   │   ├── car.get-list.service.ts
│   │   ├── car.get-model.service.ts
│   │   ├── car.update.service.ts
│   │   ├── car.upload-csv.service.ts
│   │   └── index.ts
│   └── upload-csv.middleware.ts
├── companies
│   ├── controllers
│   │   ├── company.delete.controller.ts
│   │   ├── company.get-user.controller.ts
│   │   ├── company.get.controller.ts
│   │   ├── company.patch.controller.ts
│   │   ├── company.post.controller.ts
│   │   └── index.ts
│   ├── repositories
│   │   └── company.repository.ts
│   ├── schemas
│   │   └── company.schema.ts
│   └── services
│       ├── company.delete.service.ts
│       ├── company.get-user.service.ts
│       ├── company.get.service.ts
│       ├── company.patch.service.ts
│       ├── company.post.service.ts
│       └── index.ts
├── contract-documents
│   ├── controllers
│   │   └── contract-document.controller.ts
│   ├── repositories
│   │   └── contract-document.repository.ts
│   ├── schemas
│   │   └── contract-document.schema.ts
│   └── services
│       ├── contract-document.download.service.ts
│       ├── contract-document.draft.service.ts
│       ├── contract-document.get.service.ts
│       ├── contract-document.send-email.service.ts
│       ├── contract-document.upload.service.ts
│       └── index.ts
├── contracts
│   ├── controllers
│   │   └── contract.controller.ts
│   ├── repositories
│   │   ├── contract.repository.ts
│   │   └── types
│   ├── schemas
│   │   └── contract.schema.ts
│   └── services
│       ├── contract.create.service.ts
│       ├── contract.delete.service.ts
│       ├── contract.get-car-list.service.ts
│       ├── contract.get-customer-list.service.ts
│       ├── contract.get-list.service.ts
│       ├── contract.get-user-list.service.ts
│       ├── contract.update-contracts.service.ts
│       └── index.ts
├── controllers
│   └── images
│       └── image.upload.ts
├── customers
│   ├── controllers
│   │   ├── deleteCustomers.ts
│   │   ├── getCustomerById.ts
│   │   ├── getCustomers.ts
│   │   ├── index.ts
│   │   ├── postCustomers.ts
│   │   ├── postRegister.ts
│   │   ├── updateCustomers.ts
│   │   └── uploadCustomers.ts
│   └── services
│       └── customer.upload.service.ts
├── dashboard
│   ├── controllers
│   │   └── dashboard.get.controller.ts
│   ├── repositories
│   │   ├── dashboard.get.repository.ts
│   │   ├── queries
│   │   └── types
│   └── services
│       └── dashboard.get.service.ts
├── enums
│   └── contracts-statues.ts
├── lib
│   ├── config.ts
│   ├── contract-document.upload.ts
│   ├── email
│   │   └── email.ts
│   ├── file-url.ts
│   ├── filename.ts
│   ├── images.ts
│   ├── passport
│   │   ├── index.ts
│   │   ├── jwtStrategy.ts
│   │   └── localStrategy.ts
│   ├── prisma.ts
│   └── types
│       └── express
├── middlewares
│   ├── errorHandler.ts
│   └── logger.ts
├── routers
│   ├── auth.route.ts
│   ├── car.route.ts
│   ├── company.route.ts
│   ├── contract-document.route.ts
│   ├── contract.route.ts
│   ├── customer.route.ts
│   ├── dashboard.route.ts
│   ├── image.route.ts
│   ├── index.ts
│   └── user.route.ts
└── users
    ├── controllers
    │   └── user.controller.ts
    ├── repositories
    │   └── user.repository.ts
    ├── schemas
    │   └── user.schema.ts
    └── services
        ├── index.ts
        ├── user.delete.service.ts
        ├── user.get.service.ts
        ├── user.patch.service.ts
        └── user.register.service.ts
.env.sample
.gitignore
eslint.config.js
package-lock.json
package.json
README.md
tsconfig.json
```

구현 홈페이지
(개발한 홈페이지에 대한 링크 게시)

https://www.codeit.kr/

프로젝트 회고록
(제작한 발표자료 링크 혹은 첨부파일 첨부)
