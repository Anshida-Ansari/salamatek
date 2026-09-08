import { Router } from 'express';
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/service.controller';
import { validate } from '../middlewares/validate';
import { createServiceSchema, updateServiceSchema, getServiceSchema, listServicesSchema } from '../validations/service.validation';

const router = Router();

router
  .route('/')
  .get(validate(listServicesSchema), getServices)
  .post(validate(createServiceSchema), createService);

router
  .route('/:id')
  .get(validate(getServiceSchema), getServiceById)
  .patch(validate(updateServiceSchema), updateService)
  .delete(validate(getServiceSchema), deleteService);

export default router;
