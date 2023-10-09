import { Router } from "express";
import routeSearchesController from './../controllers/routeSearchesController';

const searchRoutes = Router();

searchRoutes.get("/", routeSearchesController.get);

export { searchRoutes }
