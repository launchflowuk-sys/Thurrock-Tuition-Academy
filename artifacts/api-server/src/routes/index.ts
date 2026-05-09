import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import studentsRouter from "./students";
import sessionsRouter from "./sessions";
import progressRouter from "./progress";
import tasksRouter from "./tasks";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(studentsRouter);
router.use(sessionsRouter);
router.use(progressRouter);
router.use(tasksRouter);
router.use(paymentsRouter);
router.use(dashboardRouter);

export default router;
