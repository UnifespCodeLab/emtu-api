import { Router } from "express";
import { cityRoutes } from "./city.routes";

const router = Router();

router.use("/city", cityRoutes);

export { router }