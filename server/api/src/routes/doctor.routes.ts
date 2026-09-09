import { Router } from 'express';
import { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctor.controller';
import { validate } from '../middlewares/validate';
import { createDoctorSchema, updateDoctorSchema, getDoctorSchema, listDoctorsSchema } from '../validations/doctor.validation';

const router = Router();

router
  .route('/')
  .get(validate(listDoctorsSchema), getDoctors)
  .post(validate(createDoctorSchema), createDoctor);

router
  .route('/:id')
  .get(validate(getDoctorSchema), getDoctorById)
  .patch(validate(updateDoctorSchema), updateDoctor)
  .delete(validate(getDoctorSchema), deleteDoctor);

export default router;
