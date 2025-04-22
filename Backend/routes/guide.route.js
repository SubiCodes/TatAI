import { Router } from "express";
import { upload, deleteImageByUrl, createGuide, getGuides, getGuide, deleteGuide, addFeedback, getFeedback, hideFeedback } from "../controller/guide.controller.js";

const guideRouter = Router();

guideRouter.post('/upload', upload);
guideRouter.post('/deleteImage', deleteImageByUrl);
guideRouter.post('/create', createGuide);
guideRouter.get('/', getGuides);
guideRouter.post('/addFeedback', addFeedback)
guideRouter.get('/getFeedback/:_id', getFeedback);
guideRouter.put('/hideFeedback/:_id', hideFeedback);
guideRouter.get('/:_id', getGuide);
guideRouter.post('/:_id', deleteGuide);

export default guideRouter;