import prisma from "../../lib/prisma.js";


export const companyRepository = {
  // 회사 수정
  async updateCompanyById(companyId: number, data: { companyName: string; companyCode: string }) {
    // 1️⃣ 존재 여부 확인
    const exist = await prisma.companies.findUnique({
      where: { id: companyId },
    });
    if (!exist) {
      throw new Error("존재하지 않는 회사입니다");
    }


    // 2️⃣ 실제 수정 실행
    const company = await prisma.companies.update({
      where: { id: companyId },
      data: {
        companyName: data.companyName, // ✅ 명세서와 DB 필드명 매핑
        companyCode: data.companyCode,
      },
    });


    // 3️⃣ 관계된 유저 수 계산
    const userCount = await prisma.users.count({
      where: { companyId },
    });


    // 4️⃣ 최종 반환 (명세서 맞춤)
    return {
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount,
    };
  },


  // 회사 삭제 (참고)
  async deleteCompanyById(companyId: number) {
    await prisma.companies.delete({
      where: { id: companyId },
    });


    return { message: "회사 삭제 성공" };
  },
};



