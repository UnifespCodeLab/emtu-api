import { Router } from "express";
import accessController from "../controllers/accessController";

const accessRoutes = Router();

accessRoutes.post("/trackAccess", accessController.trackAccess);
accessRoutes.get("/dailyAccess", accessController.getDailyAccess);

export { accessRoutes };