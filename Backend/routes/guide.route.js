import { Router } from "express";
import { upload, createGuide, getGuides } from "../controller/guide.controller.js";

const guideRouter = Router();

guideRouter.post('/upload', upload);
guideRouter.post('/create', createGuide);
guideRouter.get('/guides', getGuides);

export default guideRouter;