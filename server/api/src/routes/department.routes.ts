import { Router } from 'express';
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } from '../controllers/department.controller';
import { validate } from '../middlewares/validate';
import { createDepartmentSchema, updateDepartmentSchema, getDepartmentSchema, listDepartmentsSchema } from '../validations/department.validation';

const router = Router();

router
  .route('/')
  .get(validate(listDepartmentsSchema), getDepartments)
  .post(validate(createDepartmentSchema), createDepartment);

router
  .route('/:id')
  .get(validate(getDepartmentSchema), getDepartmentById)
  .patch(validate(updateDepartmentSchema), updateDepartment)
  .delete(validate(getDepartmentSchema), deleteDepartment);

export default router;
