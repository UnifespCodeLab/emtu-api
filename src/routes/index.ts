import { Router } from "express";
import { cityRoutes } from "./city.routes";
import { cidsRoutes } from "./cids.routes";
import { userRoutes } from "./user.routes";
import { busRoutes } from './bus.routes';

const router = Router();

router.use("/city", cityRoutes);
router.use("/cids", cidsRoutes);
router.use("/user", userRoutes);
router.use("/bus", busRoutes);

export { router }
