<<<<<<< HEAD
import prisma from "../../lib/prisma.js";

=======
import prisma from "../../config/prisma.js";
>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)

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

<<<<<<< HEAD

=======
>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)
    // 2️⃣ 실제 수정 실행
    const company = await prisma.companies.update({
      where: { id: companyId },
      data: {
<<<<<<< HEAD
        companyName: data.companyName, // ✅ 명세서와 DB 필드명 매핑
        companyCode: data.companyCode,
      },
    });


=======
        name: data.companyName, // ✅ 명세서와 DB 필드명 매핑
        code: data.companyCode,
      },
    });

>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)
    // 3️⃣ 관계된 유저 수 계산
    const userCount = await prisma.users.count({
      where: { companyId },
    });

<<<<<<< HEAD

    // 4️⃣ 최종 반환 (명세서 맞춤)
    return {
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
=======
    // 4️⃣ 최종 반환 (명세서 맞춤)
    return {
      id: company.id,
      companyName: company.name,
      companyCode: company.code,
>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)
      userCount,
    };
  },

<<<<<<< HEAD

=======
>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)
  // 회사 삭제 (참고)
  async deleteCompanyById(companyId: number) {
    await prisma.companies.delete({
      where: { id: companyId },
    });

<<<<<<< HEAD

    return { message: "회사 삭제 성공" };
  },
};



=======
    return { message: "회사 삭제 성공" };
  },
};
>>>>>>> b891420 (test,feat,fix(company) : 테스트를 위한 추가 http 파일 추가 및 일부 주석 삭제, 확인용 console 라인 삭제)
