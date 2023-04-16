import { Router } from "express";
import cityController from './../controllers/cityController';

const cityRoutes = Router();

cityRoutes.get('/', cityController.getAllCities);

export { cityRoutes }

