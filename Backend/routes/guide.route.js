import { Router } from "express";
import { upload, createGuide } from "../controller/guide.controller.js";

const guideRouter = Router();

guideRouter.post('/upload', upload);
guideRouter.post('/create', createGuide);

export default guideRouter;