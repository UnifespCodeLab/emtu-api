import express from 'express';
import { busRoutes } from './bus.routes';
import { cidsRoutes } from "./cids.routes";
import { cityRoutes } from "./city.routes";
import { reportsRoutes } from "./reports.routes";
import { searchRoutes } from './search.routes';
import { userRoutes } from "./user.routes";
import { accessRoutes } from "./access.routes";

const router = express.Router();

router.use("/bus", busRoutes);
router.use("/cids", cidsRoutes);
router.use("/city", cityRoutes);
router.use("/reports", reportsRoutes);
router.use("/searches", searchRoutes);
router.use("/user", userRoutes);
router.use("/access", accessRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'emtu-api',
    uptime: process.uptime()
  });
});

export default router;
