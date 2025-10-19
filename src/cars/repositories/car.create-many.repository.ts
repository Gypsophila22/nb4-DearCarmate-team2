import prisma from "../../lib/prisma.js";

import type { Prisma } from "@prisma/client";

export const carCreateManyRepository = (data: Prisma.CarsCreateManyInput[]) => {
  return prisma.cars.createMany({
    data,
    skipDuplicates: true,
  });
};
