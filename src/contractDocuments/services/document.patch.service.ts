import prisma from '../../lib/prisma.js';

type PatchContractDocsInput = {
  addDocumentIds?: unknown;
  removeDocumentIds?: unknown;
  rename?: unknown;
};

type Args = {
  contractId: number;
  actor: { id: number; companyId: number; isAdmin?: boolean };
  body: PatchContractDocsInput;
};

export async function patchContractDocuments({
  contractId,
  actor,
  body,
}: Args) {
  // ✅ 최소 정규화 (스키마에 의존하지 않음)
  const addDocumentIds: number[] = Array.isArray(body.addDocumentIds)
    ? body.addDocumentIds.filter((n): n is number =>
        Number.isInteger(n as number)
      )
    : [];

  const removeDocumentIds: number[] = Array.isArray(body.removeDocumentIds)
    ? body.removeDocumentIds.filter((n): n is number =>
        Number.isInteger(n as number)
      )
    : [];

  const rename: { id: number; fileName: string }[] = Array.isArray(body.rename)
    ? body.rename
        .filter(
          (r: any) =>
            r &&
            Number.isInteger(r.id) &&
            typeof r.fileName === 'string' &&
            r.fileName.length > 0
        )
        .map((r: any) => ({ id: r.id, fileName: r.fileName }))
    : [];

  // 권한/회사 경계
  const contract = await prisma.contracts.findFirst({
    where: { id: contractId },
    select: {
      id: true,
      userId: true,
      user: { select: { companyId: true, name: true } },
      customer: { select: { id: true, name: true, email: true } },
    },
  });
  if (!contract) {
    return {
      message: '존재하지 않는 계약입니다',
      added: [],
      removed: [],
      renamed: [],
      documentCount: 0,
    };
  }
  if (actor.companyId !== contract.user.companyId && !actor.isAdmin) {
    return {
      message: '권한이 없습니다',
      added: [],
      removed: [],
      renamed: [],
      documentCount: 0,
    };
  }
  if (actor.id !== contract.userId && !actor.isAdmin) {
    return {
      message: '담당자만 수정이 가능합니다',
      added: [],
      removed: [],
      renamed: [],
      documentCount: 0,
    };
  }

  const { docCount } = await prisma.$transaction(async (tx) => {
    if (addDocumentIds.length) {
      const addables = await tx.contractDocuments.findMany({
        where: {
          id: { in: addDocumentIds },
          companyId: contract.user.companyId,
          OR: [{ contractId: null }, { contractId }],
        },
        select: { id: true },
      });
      const ok = new Set(addables.map((d) => d.id));
      const invalid = addDocumentIds.filter((id) => !ok.has(id));
      if (invalid.length) {
        const err: any = new Error('연결 불가한 문서가 포함되어 있습니다');
        err.status = 400;
        err.detail = { invalidAddIds: invalid };
        throw err;
      }

      await tx.contractDocuments.updateMany({
        where: { id: { in: addDocumentIds } },
        data: { contractId, status: 'LINKED' },
      });
    }

    if (removeDocumentIds.length) {
      const removable = await tx.contractDocuments.findMany({
        where: { id: { in: removeDocumentIds }, contractId },
        select: { id: true },
      });
      const ok = new Set(removable.map((d) => d.id));
      const invalid = removeDocumentIds.filter((id) => !ok.has(id));
      if (invalid.length) {
        const err: any = new Error(
          '이 계약에 속하지 않은 문서가 포함되어 있습니다'
        );
        err.status = 400;
        err.detail = { invalidRemoveIds: invalid };
        throw err;
      }

      await tx.contractDocuments.updateMany({
        where: { id: { in: removeDocumentIds }, contractId },
        data: { contractId: null, status: 'TEMP' },
      });
    }

    if (rename.length) {
      for (const r of rename) {
        await tx.contractDocuments.updateMany({
          where: {
            id: r.id,
            companyId: contract.user.companyId,
            OR: [{ contractId }, { contractId: null }],
          },
          data: { originalName: r.fileName },
        });
      }
    }

    const count = await tx.contractDocuments.count({ where: { contractId } });
    return { docCount: count };
  });

  // 부수효과(메일)는 트랜잭션 밖에서
  if (addDocumentIds.length) {
    // await mailer.sendContractDocumentsLinked({ to: contract.customer.email, ... })
  }

  return {
    message: '계약 문서가 수정되었습니다',
    documentCount: docCount,
    added: addDocumentIds,
    removed: removeDocumentIds,
    renamed: rename.map((r) => r.id),
  };
}
