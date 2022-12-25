import { Router } from "express";
import { cityRoutes } from "./city.routes";
import { cidsRoutes } from "./cids.routes";

const router = Router();

router.use("/city", cityRoutes);
router.use("/cids", cidsRoutes);

export { router }