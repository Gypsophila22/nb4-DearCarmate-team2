import { AgeGroup, Region } from '@prisma/client';
import { ageGroupMap, regionMap } from '../enums/customer.enums.js';

export function mapAgeGroupToKorean(
  ageGroup: AgeGroup | null | undefined,
): string | null {
  if (!ageGroup) {
    return null;
  }
  return ageGroupMap[ageGroup] || null;
}

export function mapRegionToKorean(
  region: Region | null | undefined,
): string | null {
  if (!region) {
    return null;
  }
  return regionMap[region] || null;
}

export function mapAgeGroupToEnum(
  koreanAgeGroup: string | undefined | null,
): AgeGroup | null {
  if (!koreanAgeGroup) return null;

  const match = koreanAgeGroup.match(/^(\d{2})-\d{2}$/);
  if (match && match[1]) {
    const decade = `${match[1]}대`;
    for (const key in ageGroupMap) {
      if (ageGroupMap[key as AgeGroup] === decade) {
        return key as AgeGroup;
      }
    }
  }

  for (const key in ageGroupMap) {
    if (ageGroupMap[key as AgeGroup] === koreanAgeGroup) {
      return key as AgeGroup;
    }
  }

  return null;
}

export function mapRegionToEnum(
  koreanRegion: string | undefined | null,
): Region | null {
  if (!koreanRegion) return null;

  for (const key in regionMap) {
    if (regionMap[key as Region] === koreanRegion) {
      return key as Region;
    }
  }

  return null;
}

export function toAgeGroupEnum(
  value: string | undefined | null,
): AgeGroup | undefined {
  if (!value) return undefined;
  const upperCaseValue = value.toUpperCase();
  if (Object.values(AgeGroup).includes(upperCaseValue as AgeGroup)) {
    return upperCaseValue as AgeGroup;
  }
  const mappedFromKorean = mapAgeGroupToEnum(value);
  if (mappedFromKorean) {
    return mappedFromKorean;
  }
  return undefined;
}

export function toRegionEnum(
  value: string | undefined | null,
): Region | undefined {
  if (!value) return undefined;
  const upperCaseValue = value.toUpperCase();
  if (Object.values(Region).includes(upperCaseValue as Region)) {
    return upperCaseValue as Region;
  }
  const mappedFromKorean = mapRegionToEnum(value);
  if (mappedFromKorean) {
    return mappedFromKorean;
  }
  return undefined;
}
