import { z } from "zod";

import { GetCarsListResponseDto } from "../../auth/dtos/cars/getCarsListResponseDto.js";

export const getCarsListSerializer = (
  // TODO: any 변경
  cars: any[],
  currentPage: number,
  pageSize: number,
  totalItemCount: number
) => {
  return GetCarsListResponseDto.parse({
    currentPage: currentPage,
    totalPages: Math.ceil(totalItemCount / pageSize),
    totalItemCount: totalItemCount,
    data: cars.map((car) => ({
      id: car.id,
      carNumber: car.carNumber,
      manufacturer: car.carModel.manufacturer,
      model: car.carModel.model,
      type: car.carModel.type,
      manufacturingYear: car.manufacturingYear,
      mileage: car.mileage,
      price: car.price,
      accidentCount: car.accidentCount,
      explanation: car.explanation,
      accidentDetails: car.accidentDetails,
      status: car.status,
    })),
  });
};
