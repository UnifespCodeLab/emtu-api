import { Router } from "express";
import routeSearchesController from './../controllers/routeSearchesController';

const searchRoutes = Router();

searchRoutes.post("/", routeSearchesController.create);

export { searchRoutes }
