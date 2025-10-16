// src/contracts/controllers/patchContract.controller.ts
import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';
import { z, ZodError } from 'zod';
import { ContractsStatus } from '@prisma/client';

// 요청 바디 스키마 (명세서 그대로)
const meetingSchema = z.object({
  date: z.string().min(1), // "2024-02-22"
  alarms: z.array(z.string().min(1)).optional().default([]), // ISO 문자열들
});

const bodySchema = z.object({
  status: z.nativeEnum(ContractsStatus).optional(),
  resolutionDate: z.string().datetime().optional(), // "2024-02-22T09:00:00"
  contractPrice: z.number().int().nonnegative().optional(),
  meetings: z.array(meetingSchema).optional(),
  contractDocuments: z
    .array(
      z.object({
        id: z.number().int().positive(),
        fileName: z.string().min(1).optional(),
      })
    )
    .optional(),
  userId: z.number().int().positive().optional(),
  customerId: z.number().int().positive().optional(),
  // 명세에 "carid" 오탈자 케이스도 안전하게 수용
  carid: z.number().int().positive().optional(),
  carId: z.number().int().positive().optional(),
});

export async function patchContract(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });

    // 1) 파라미터 검증
    const contractId = Number(req.params.contractId ?? req.params.id);
    if (!Number.isInteger(contractId) || contractId <= 0) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 2) 바디 검증
    const parsed = bodySchema.parse(req.body);
    const carId = parsed.carId ?? parsed.carid; // 둘 중 하나만 있으면 사용

    // 3) 존재/소유/권한 검증 (담당자만 수정 가능)
    const found = await prisma.contracts.findFirst({
      where: { id: contractId },
      select: {
        id: true,
        userId: true,
        customerId: true,
        carId: true,
        user: { select: { companyId: true } },
      },
    });
    if (!found)
      return res.status(404).json({ message: '존재하지 않는 계약입니다' });

    // 사용자가 같은 회사인지(보통 미들웨어에서 보지만 안전망)
    if (req.user.companyId !== found.user.companyId) {
      return res.status(403).json({ message: '담당자만 수정이 가능합니다' });
    }
    // 담당자 권한 확인 (관리자 예외를 두려면: || req.user.isAdmin)
    if (req.user.id !== found.userId) {
      return res.status(403).json({ message: '담당자만 수정이 가능합니다' });
    }

    // 4) 트랜잭션으로 업데이트
    const result = await prisma.$transaction(async (tx) => {
      // 4-1) 본문 필드 업데이트 데이터 구성
      const dataUpdate: any = {};
      if (parsed.status !== undefined) dataUpdate.status = parsed.status;
      if (parsed.resolutionDate !== undefined)
        dataUpdate.resolutionDate = new Date(parsed.resolutionDate);
      if (parsed.contractPrice !== undefined)
        dataUpdate.contractPrice = parsed.contractPrice;
      if (parsed.userId !== undefined) dataUpdate.userId = parsed.userId;
      if (parsed.customerId !== undefined)
        dataUpdate.customerId = parsed.customerId;
      if (carId !== undefined) dataUpdate.carId = carId;

      // 4-2) 계약 본문 업데이트
      await tx.contracts.update({
        where: { id: contractId },
        data: dataUpdate,
      });

      // 4-3) 미팅/알람 업데이트 (간단히 전량 갈아끼우기 전략)
      if (parsed.meetings !== undefined) {
        // 기존 미팅/알람 삭제
        await tx.alarms.deleteMany({ where: { meeting: { contractId } } });
        await tx.meetings.deleteMany({ where: { contractId } });

        // 새로 생성
        for (const m of parsed.meetings) {
          const meeting = await tx.meetings.create({
            data: {
              contractId,
              // 날짜만 들어오므로 00:00:00로 간주
              date: new Date(m.date),
            },
            select: { id: true },
          });
          if (m.alarms && m.alarms.length) {
            await tx.alarms.createMany({
              data: m.alarms.map((iso) => ({
                meetingId: meeting.id,
                time: new Date(iso),
              })),
            });
          }
        }
      }

      // 4-4) 계약서(문서) 재귀속 (옵션)
      if (parsed.contractDocuments && parsed.contractDocuments.length) {
        const docIds = parsed.contractDocuments.map((d) => d.id);
        await tx.contractDocuments.updateMany({
          where: { id: { in: docIds } },
          data: { contractId },
        });
      }

      // 4-5) 최종 응답용 조회
      const final = await tx.contracts.findUnique({
        where: { id: contractId },
        select: {
          id: true,
          status: true,
          resolutionDate: true,
          contractPrice: true,
          meetings: {
            orderBy: { date: 'asc' },
            select: {
              date: true,
              alarms: { orderBy: { time: 'asc' }, select: { time: true } },
            },
          },
          user: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          car: {
            select: {
              id: true,
              carModel: { select: { model: true } },
            },
          },
        },
      });

      return final!;
    });

    // 5) 응답 포맷 맞추기
    return res.status(200).json({
      id: result.id,
      status: result.status,
      resolutionDate: result.resolutionDate,
      contractPrice: result.contractPrice,
      meetings: result.meetings.map((m) => ({
        date: m.date,
        alarms: m.alarms.map((a) => a.time),
      })),
      user: result.user,
      customer: result.customer,
      car: {
        id: result.car?.id ?? null,
        model: result.car?.carModel?.model ?? null,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ message: '잘못된 요청입니다', errors: err.issues });
    }
    next(err);
  }
}
