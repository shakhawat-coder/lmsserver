import { Router } from "express";
import { StatisticsController } from "./statistics.controller";

const router = Router();

// This route should be public
router.get("/", StatisticsController.getStatistics);

export const statisticsRouter = router;
