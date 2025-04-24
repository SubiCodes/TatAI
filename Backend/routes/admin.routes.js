import { Router } from "express";
import { changeStatus, addAccount, deleteAccount, checkUserRole, changeRole, getAdminData, editAdminData, getCount, getLiveGuidesCount, getRatingsCount, getLatestFeedback, getLatestGuides } from "../controller/admin.controller.js"

const adminRouter = Router();

adminRouter.post("/add-account", addAccount);
adminRouter.post("/delete-account/:_id", deleteAccount);
adminRouter.post("/status-change/:_id", changeStatus);
adminRouter.post("/role-change/:_id", changeRole);
adminRouter.get("/check-role", checkUserRole);
adminRouter.get("/admin-data", getAdminData);
adminRouter.put("/edit-admin-data/:_id", editAdminData);
adminRouter.get("/user-guide-count", getCount);
adminRouter.get("/live-guide-count", getLiveGuidesCount);
adminRouter.get("/guide-ratings", getRatingsCount);
adminRouter.get("/latest-feedback", getLatestFeedback);
adminRouter.get("/latest-guides", getLatestGuides);

export default adminRouter;