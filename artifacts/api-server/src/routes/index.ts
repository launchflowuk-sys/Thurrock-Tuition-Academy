import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import studentsRouter from "./students";
import sessionsRouter from "./sessions";
import progressRouter from "./progress";
import tasksRouter from "./tasks";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";
import settingsRouter from "./settings";
import staffRouter from "./staff";
import storageRouter from "./storage";
import messagesRouter from "./messages";
import intakeRouter from "./intake-submissions";
import coursesRouter from "./courses";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(studentsRouter);
router.use(sessionsRouter);
router.use(progressRouter);
router.use(tasksRouter);
router.use(paymentsRouter);
router.use(dashboardRouter);
router.use(settingsRouter);
router.use(staffRouter);
router.use(storageRouter);
router.use(messagesRouter);
router.use(intakeRouter);
router.use(coursesRouter);

export default router;
