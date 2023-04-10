import { Router } from "express";
import reportsController from './../controllers/reportsController';

const reportsRoutes = Router();

reportsRoutes.post("/", reportsController.create);

export { reportsRoutes }

