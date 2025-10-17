import prisma from '../../lib/prisma.js';

export const documentDownloadRepository = {
  findByIdForCompany(params: {
    contractDocumentId: number;
    companyId: number;
  }) {
    const { contractDocumentId, companyId } = params;
    return prisma.contractDocuments.findFirst({
      where: { id: contractDocumentId, companyId },
      select: {
        id: true,
        originalName: true,
        storedName: true,
        path: true,
        url: true,
        mimeType: true,
      },
    });
  },
};
