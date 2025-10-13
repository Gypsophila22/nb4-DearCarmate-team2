import type { Request, Response, NextFunction } from "express";

// 회사 목록 조회 (GET /admin/companies)
async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    // 페이지네이션 파라미터 기본값 처리
    const { page = "1", pageSize = "10" } = req.query;

    // 현 더미 데이터.
    // 나중에는 prisma.companies.findMany()와 prisma.companies.count()로 교체 필요
    const items = [
      {
        id: 1,
        companyName: "코드카",
        companyCode: "CARMATE123",
        userCount: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        companyName: "오토모빌",
        companyCode: "AUTO456",
        userCount: 3,
        createdAt: new Date().toISOString(),
      },
    ];

    // 페이지 정보: 현 더미 데이터
    // 실제 DB 연동 시 totalPages, totalItems를 prisma.count() 결과로 계산 필요. 
    const pageInfo = {
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: 1,
      totalItems: items.length,
    };

    // 최종 응답 구조
    return res.json({ success: true, data: { items, pageInfo } });
  } catch (err) {
    // 에러 발생 시 Express 에러 핸들러로 전달
    next(err);
  }
}

export default { getCompany };
