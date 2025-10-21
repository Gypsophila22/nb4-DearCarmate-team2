import createError from 'http-errors';

import { ContractsStatus } from '@prisma/client';

import prisma from '../../lib/prisma.js';
import contractRepository from '../repositories/index.js';
import { sendContractDocsLinkedEmail } from '../../contractDocuments/services/contract-document.send-email.service.js';

// 계약 상태 변경
interface UpdateContractInput {
  contractId: number;
  status?: ContractsStatus; // 계약 상태
  resolutionDate?: string; // 계약 종료일
  contractPrice?: number; // 계약 가격
  meetings?: { id?: number; date: string; alarms: string[] }[]; // 일정
  contractDocuments?: { id?: number; fileName?: string }[]; // 계약서
  userId?: number; // 담당자
  customerId?: number; // 고객
  carId?: number; // 차량
}

export const updateContractsService = async (
  userId: number,
  data: UpdateContractInput,
) => {
  // 계약 존재 여부 확인
  const contract = await contractRepository.findContract(data.contractId);
  if (!contract) {
    throw createError(404, '존재하지 않는 계약입니다');
  }
  if (contract.userId !== userId) {
    throw createError(403, '담당자만 수정이 가능합니다');
  }
  if (data.carId) {
    // 차량 존재 확인 및 보유중인지 체크
    const car = await contractRepository.findCar(data.carId);
    if (!car) {
      throw new Error('존재하지 않는 차량입니다');
    }
    // 기존 보유중 상태로 조회 -> 계약 연결 없는 차량 조회로 변경되면서 필요없어짐
    // if (car.status !== 'possession') {
    //   // 보유 중인 차량만 계약 가능
    //   throw new Error('보유 중인 차량이 아닙니다');
    // }
  }

  // 계약 정보 업데이트 (undefined인 필드를 data 객체에서 제외)
  await contractRepository.update.updateContract(data.contractId, {
    ...(data.status && { status: data.status }),
    ...(data.contractPrice !== undefined && {
      contractPrice: { set: data.contractPrice },
    }),
    ...(data.resolutionDate && {
      resolutionDate: new Date(data.resolutionDate),
    }),
    ...(data.userId && { user: { connect: { id: data.userId } } }),
    ...(data.customerId && {
      customer: { connect: { id: data.customerId } },
    }),
    }),
  });

  // 미팅 정보 업데이트
  if (data.meetings) {
    if (data.meetings.length === 0) {
      await prisma.alarms.deleteMany({
        where: {
          meeting: {
            contractId: data.contractId,
          },
        },
      });
      await prisma.meetings.deleteMany({
        where: { contractId: data.contractId },
      });
    } else {
      await contractRepository.update.updateMeetings(
        data.contractId,
        data.meetings,
      );
    }
  }

  // 계약 문서 업데이트 수정(업로드>계약 수정 흐름이라 불가피하게 변경했습니다)
  if (data.contractDocuments !== undefined) {
    const touchingIds = data.contractDocuments
      .map((d) => d?.id)
      .filter((v): v is number => typeof v === 'number');
    const beforeRows = touchingIds.length
      ? await prisma.contractDocuments.findMany({
          where: { id: { in: touchingIds } },
          select: { id: true, contractId: true },
        })
      : [];
    const beforeMap = new Map(beforeRows.map((r) => [r.id, r.contractId]));

    if (data.contractDocuments.length === 0) {
      // 빈 배열이면 이 계약의 모든 문서 연결 해제
      await prisma.contractDocuments.updateMany({
        where: { contractId: data.contractId },
        data: { contractId: null },
      });
    } else {
      const validDocs = data.contractDocuments.filter(
        (doc): doc is { id: number; fileName: string } =>
          !!doc.id && !!doc.fileName,
      );

      if (validDocs.length > 0) {
        await contractRepository.update.updateContractDocuments(
          data.contractId,
          validDocs.map((doc) => ({
            id: doc.id,
            originalName: doc.fileName,
          })),
        );

        const afterRows = await prisma.contractDocuments.findMany({
          where: { id: { in: validDocs.map((d) => d.id) } },
          select: { id: true, contractId: true },
        });

        const newlyLinked = afterRows
          .filter((row) => {
            const was = beforeMap.get(row.id) ?? null; // 이전 contractId
            const now = row.contractId ?? null; // 현재 contractId
            return was === null && now === data.contractId; // 이번 PATCH로 null → 이 계약 id
          })
          .map((r) => r.id);
        if (newlyLinked.length > 0) {
          sendContractDocsLinkedEmail(newlyLinked)
            .then(() => console.log('[email] sent'))
            .catch((err) => console.error('[email] failed', err));
        }
      }
    }
  }

  // 최종 조회
  const contractResponse = await contractRepository.update.findByIdForResponse(
    data.contractId,
  );

  if (!contractResponse) {
    throw createError(404, '계약을 찾을 수 없습니다.');
  }

  const response = {
    id: contractResponse.id,
    status: contractResponse.status,
    resolutionDate: contractResponse.resolutionDate.toISOString(),
    contractPrice: contractResponse.contractPrice,
    meetings: contractResponse.meetings.map((m) => ({
      date: m.date.toISOString().split('T')[0], // YYYY-MM-DD
      alarms: m.alarms.map((a) => a.time.toISOString()),
    })),
    user: {
      id: contractResponse.user.id,
      name: contractResponse.user.name,
    },
    customer: {
      id: contractResponse.customer.id,
      name: contractResponse.customer.name,
    },
    car: {
      id: contractResponse.car.id,
      model: contractResponse.car.carModel.model,
    },
  };
  return response;
};
// import createError from 'http-errors';
// import { ContractsStatus } from '@prisma/client';

// import prisma from '../../lib/prisma.js';
// import contractRepository from '../repositories/index.js';
// import { sendContractDocsLinkedEmail } from '../../contractDocuments/services/contract-document.send-email.service.js';

// interface UpdateContractInput {
//   contractId: number;
//   status?: ContractsStatus;
//   resolutionDate?: string;
//   contractPrice?: number;
//   meetings?: { id?: number; date: string; alarms: string[] }[];
//   contractDocuments?: { id?: number; fileName?: string }[];
//   userId?: number;
//   customerId?: number;
//   carId?: number; // ← 들어올 수는 있으나 업데이트에서는 금지
// }

// export const updateContractsService = async (
//   userId: number,
//   data: UpdateContractInput,
// ) => {
//   console.log('패치 서비스 지나감');

//   // 1) 계약 존재/권한
//   const contract = await contractRepository.findContract(data.contractId);
//   if (!contract) throw createError(404, '존재하지 않는 계약입니다');
//   if (contract.userId !== userId)
//     throw createError(403, '담당자만 수정이 가능합니다');

//   // 2) 차량 변경 불가 정책 적용
//   const isCarChanging =
//     Object.prototype.hasOwnProperty.call(data, 'carId') &&
//     data.carId !== null &&
//     data.carId !== undefined &&
//     data.carId !== contract.carId;

//   if (isCarChanging) {
//     // 정책상 금지
//     throw createError(400, '계약 등록 후에는 차량을 변경할 수 없습니다.');
//   }

//   // 3) 업데이트 페이로드에서 carId는 아예 무시
//   const { carId: _ignoredCarId, ...rest } = data;
//   void _ignoredCarId;

//   // 4) 본 계약 필드 업데이트 (car connect 없음)
//   await contractRepository.update.updateContract(data.contractId, {
//     ...(rest.status && { status: rest.status }),
//     ...(rest.contractPrice !== undefined && {
//       contractPrice: { set: rest.contractPrice },
//     }),
//     ...(rest.resolutionDate && {
//       resolutionDate: new Date(rest.resolutionDate),
//     }),
//     ...(rest.userId && { user: { connect: { id: rest.userId } } }),
//     ...(rest.customerId && { customer: { connect: { id: rest.customerId } } }),
//   });

//   // 5) 미팅 정보 업데이트
//   if (rest.meetings) {
//     if (rest.meetings.length === 0) {
//       await prisma.alarms.deleteMany({
//         where: { meeting: { contractId: data.contractId } },
//       });
//       await prisma.meetings.deleteMany({
//         where: { contractId: data.contractId },
//       });
//     } else {
//       await contractRepository.update.updateMeetings(
//         data.contractId,
//         rest.meetings,
//       );
//     }
//   }

//   // 6) 계약 문서 업데이트
//   if (rest.contractDocuments !== undefined) {
//     const touchingIds = rest.contractDocuments
//       .map((d) => d?.id)
//       .filter((v): v is number => typeof v === 'number');
//     const beforeRows = touchingIds.length
//       ? await prisma.contractDocuments.findMany({
//           where: { id: { in: touchingIds } },
//           select: { id: true, contractId: true },
//         })
//       : [];
//     const beforeMap = new Map(beforeRows.map((r) => [r.id, r.contractId]));

//     if (rest.contractDocuments.length === 0) {
//       await prisma.contractDocuments.updateMany({
//         where: { contractId: data.contractId },
//         data: { contractId: null },
//       });
//     } else {
//       const validDocs = rest.contractDocuments.filter(
//         (doc): doc is { id: number; fileName: string } =>
//           !!doc.id && !!doc.fileName,
//       );

//       if (validDocs.length > 0) {
//         await contractRepository.update.updateContractDocuments(
//           data.contractId,
//           validDocs.map((doc) => ({
//             id: doc.id,
//             originalName: doc.fileName,
//           })),
//         );

//         const afterRows = await prisma.contractDocuments.findMany({
//           where: { id: { in: validDocs.map((d) => d.id) } },
//           select: { id: true, contractId: true },
//         });

//         const newlyLinked = afterRows
//           .filter((row) => {
//             const was = beforeMap.get(row.id) ?? null;
//             const now = row.contractId ?? null;
//             return was === null && now === data.contractId;
//           })
//           .map((r) => r.id);

//         if (newlyLinked.length > 0) {
//           sendContractDocsLinkedEmail(newlyLinked)
//             .then(() => console.log('[email] sent'))
//             .catch((err) => console.error('[email] failed', err));
//         }
//       }
//     }
//   }

//   // 7) 최종 조회/응답
//   const contractResponse = await contractRepository.update.findByIdForResponse(
//     data.contractId,
//   );
//   if (!contractResponse) throw createError(404, '계약을 찾을 수 없습니다.');

//   const response = {
//     id: contractResponse.id,
//     status: contractResponse.status,
//     resolutionDate: contractResponse.resolutionDate.toISOString(),
//     contractPrice: contractResponse.contractPrice,
//     meetings: contractResponse.meetings.map((m) => ({
//       date: m.date.toISOString().split('T')[0], // YYYY-MM-DD
//       alarms: m.alarms.map((a) => a.time.toISOString()),
//     })),
//     user: {
//       id: contractResponse.user.id,
//       name: contractResponse.user.name,
//     },
//     customer: {
//       id: contractResponse.customer.id,
//       name: contractResponse.customer.name,
//     },
//     car: {
//       id: contractResponse.car.id,
//       model: contractResponse.car.carModel.model,
//     },
//   };

//   console.log('[svc:updateContracts] EXIT', { id: data.contractId });
//   return response;
// };
