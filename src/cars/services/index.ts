import { createCarsService } from './car.create.service.js';
import { carDeleteService } from './car.delete.service.js';
import { carGetByIdService } from './car.get-by-id.service.js';
import { carGetListService } from './car.get-list.service.js';
import { carGetModelService } from './car.get-model.service.js';
import { carUpdateService } from './car.update.service.js';
import { carUploadCsvService } from './car.upload-csv.service.js';

const carService = {
  create: createCarsService,
  delete: carDeleteService,
  update: carUpdateService,
  getById: carGetByIdService,
  list: carGetListService,
  getModel: carGetModelService,
  uploadCsv: carUploadCsvService,
};

Object.freeze(carService);

export default carService;
