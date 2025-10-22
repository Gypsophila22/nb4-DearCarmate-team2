import { AgeGroup, Gender, Region } from '@prisma/client';
import prisma from '../../lib/prisma.js';

interface CustomerUploadData {
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup?: string;
  region?: string;
  email?: string;
  memo?: string;
}

const ageGroupMap: { [key: string]: AgeGroup } = {
  '10대': AgeGroup.GENERATION_10,
  '20대': AgeGroup.GENERATION_20,
  '30대': AgeGroup.GENERATION_30,
  '40대': AgeGroup.GENERATION_40,
  '50대': AgeGroup.GENERATION_50,
  '60대': AgeGroup.GENERATION_60,
  '70대': AgeGroup.GENERATION_70,
  '80대': AgeGroup.GENERATION_80,
  '10-20': AgeGroup.GENERATION_10,
  '20-30': AgeGroup.GENERATION_20,
  '30-40': AgeGroup.GENERATION_30,
  '40-50': AgeGroup.GENERATION_40,
  '50-60': AgeGroup.GENERATION_50,
  '60-70': AgeGroup.GENERATION_60,
  '70-80': AgeGroup.GENERATION_70,
  '80대 이상': AgeGroup.GENERATION_80,
};

const regionMap: { [key: string]: Region } = {
  서울: Region.서울,
  경기: Region.경기,
  인천: Region.인천,
  강원: Region.강원,
  충북: Region.충북,
  충남: Region.충남,
  세종: Region.세종,
  대전: Region.대전,
  전북: Region.전북,
  전남: Region.전남,
  광주: Region.광주,
  경북: Region.경북,
  경남: Region.경남,
  대구: Region.대구,
  울산: Region.울산,
  부산: Region.부산,
  제주: Region.제주,
};

export const customerUploadService = {
  async processCustomerCsv(customers: CustomerUploadData[], companyId: number) {
    const results = {
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as { data: CustomerUploadData; error: string }[],
    };

    await prisma.$transaction(async (tx) => {
      for (const customerData of customers) {
        try {
          const mappedData = {
            ...customerData,
            ageGroup: customerData.ageGroup
              ? ageGroupMap[customerData.ageGroup]
              : undefined,
            region: customerData.region
              ? regionMap[customerData.region]
              : undefined,
          };

          let existingCustomer;
          if (mappedData.email) {
            existingCustomer = await tx.customers.findFirst({
              where: { email: mappedData.email, companyId },
            });
          } else if (mappedData.phoneNumber) {
            existingCustomer = await tx.customers.findFirst({
              where: { phoneNumber: mappedData.phoneNumber, companyId },
            });
          }

          if (existingCustomer) {
            // 기존 고객이 있으면 업데이트
            await tx.customers.update({
              where: { id: existingCustomer.id },
              data: {
                name: mappedData.name,
                gender: mappedData.gender,
                phoneNumber: mappedData.phoneNumber,
                ageGroup: mappedData.ageGroup,
                region: mappedData.region,
                email: mappedData.email,
                memo: mappedData.memo,
                companyId: companyId,
              },
            });
            results.updated++;
          } else {
            // 새 고객 생성
            await tx.customers.create({
              data: {
                name: mappedData.name,
                gender: mappedData.gender,
                phoneNumber: mappedData.phoneNumber,
                ageGroup: mappedData.ageGroup,
                region: mappedData.region,
                email: mappedData.email,
                memo: mappedData.memo,
                companyId: companyId,
              },
            });
            results.created++;
          }
        } catch (error: unknown) {
          results.failed++;
          results.errors.push({
            data: customerData,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    });

    console.log('Customer CSV upload results:', results);
    return results;
  },
};
