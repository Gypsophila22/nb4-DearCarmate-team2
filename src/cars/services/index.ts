import { carUploadCsvService } from './car.upload-csv.service.js';

const carService = {
  uploadCsv: carUploadCsvService,
};

Object.freeze(carService);

export default carService;
