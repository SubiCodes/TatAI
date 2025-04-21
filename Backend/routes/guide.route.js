import { Router } from "express";
import { upload, deleteImageByUrl, createGuide, getGuides, getGuide, deleteGuide, addFeedback } from "../controller/guide.controller.js";

const guideRouter = Router();

guideRouter.post('/upload', upload);
guideRouter.post('/deleteImage', deleteImageByUrl);
guideRouter.post('/create', createGuide);
guideRouter.post('/addFeedback', addFeedback)
guideRouter.get('/', getGuides);
guideRouter.get('/:_id', getGuide);
guideRouter.post('/:_id', deleteGuide);

export default guideRouter;