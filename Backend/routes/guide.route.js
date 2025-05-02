import { Router } from "express";
import { upload, deleteImageByUrl, createGuide, updateGuide, getGuides, getGuidesPerType, getGuide, getUserGuides, deleteGuide, updateGuideStatus, addFeedback, getFeedback, getUserFeedback, getAllComments, hideFeedback } from "../controller/guide.controller.js";

const guideRouter = Router();


guideRouter.post('/edit-guide', updateGuide);


guideRouter.post('/upload', upload);
guideRouter.post('/deleteImage', deleteImageByUrl);
guideRouter.post('/create', createGuide);
guideRouter.get('/', getGuides);
guideRouter.post('/pertype', getGuidesPerType);
guideRouter.get('/user-guides/:_id', getUserGuides);
guideRouter.post('/addFeedback', addFeedback);
guideRouter.put('/guideStatus/:_id', updateGuideStatus);
guideRouter.get('/getFeedback/:_id', getFeedback);
guideRouter.get('/getUserFeedback/:_id', getUserFeedback);
guideRouter.get('/getAllComments', getAllComments);
guideRouter.put('/hideFeedback/:_id', hideFeedback);
guideRouter.get('/:_id', getGuide);
guideRouter.post('/:_id', deleteGuide);

export default guideRouter;