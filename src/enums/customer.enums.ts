import { AgeGroup, Region } from '@prisma/client';

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

export const regionMap: Record<Region, string> = {
  [Region.서울]: '서울',
  [Region.경기]: '경기',
  [Region.인천]: '인천',
  [Region.강원]: '강원',
  [Region.충북]: '충북',
  [Region.충남]: '충남',
  [Region.세종]: '세종',
  [Region.대전]: '대전',
  [Region.전북]: '전북',
  [Region.전남]: '전남',
  [Region.광주]: '광주',
  [Region.경북]: '경북',
  [Region.경남]: '경남',
  [Region.대구]: '대구',
  [Region.울산]: '울산',
  [Region.부산]: '부산',
  [Region.제주]: '제주',
};
