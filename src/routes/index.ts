import { Router } from "express";
import { cityRoutes } from "./city.routes";
import { cidsRoutes } from "./cids.routes";
import { userRoutes } from "./user.routes";

const router = Router();

router.use("/city", cityRoutes);
router.use("/cids", cidsRoutes);
router.use("/user", userRoutes);

export { router }
