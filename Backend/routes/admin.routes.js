import { Router } from "express";
import { changeStatus } from "../controller/admin.controller.js"

const adminRouter = Router();

adminRouter.post("/status-change/:_id", changeStatus);

export default adminRouter;