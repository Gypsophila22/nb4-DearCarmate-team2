import prisma from '../../lib/prisma.js';

export const documentUploadRepository = {
  createTemp(params: {
    companyId: number;
    uploaderId: number;
    originalName: string;
    storedName: string;
    mimeType: string;
    size: number;
    path: string | null;
  }) {
    return prisma.contractDocuments.create({
      data: {
        companyId: params.companyId,
        uploaderId: params.uploaderId,
        originalName: params.originalName,
        storedName: params.storedName,
        mimeType: params.mimeType,
        size: params.size,
        path: params.path,
        status: 'TEMP',
      },
      select: { id: true },
    });
  },
};
