import { Router } from "express";
import { changeStatus, addAccount, deleteAccount, checkUserRole, changeRole } from "../controller/admin.controller.js"

const adminRouter = Router();

adminRouter.post("/add-account", addAccount);
adminRouter.post("/delete-account/:_id", deleteAccount);
adminRouter.post("/status-change/:_id", changeStatus);
adminRouter.post("/role-change/:_id", changeRole);
adminRouter.get("/check-role", checkUserRole);

export default adminRouter;