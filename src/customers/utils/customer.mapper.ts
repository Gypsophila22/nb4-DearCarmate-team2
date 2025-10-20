import { AgeGroup } from '@prisma/client';

export const ageGroupMap: Record<AgeGroup, string> = {
  [AgeGroup.GENERATION_10]: '10대',
  [AgeGroup.GENERATION_20]: '20대',
  [AgeGroup.GENERATION_30]: '30대',
  [AgeGroup.GENERATION_40]: '40대',
  [AgeGroup.GENERATION_50]: '50대',
  [AgeGroup.GENERATION_60]: '60대',
  [AgeGroup.GENERATION_70]: '70대',
  [AgeGroup.GENERATION_80]: '80대',
};

export function mapAgeGroupToKorean(ageGroup: AgeGroup | null | undefined): string | null {
  if (!ageGroup) {
    return null;
  }
  return ageGroupMap[ageGroup] || ageGroup;
}
