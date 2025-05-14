import { Router } from "express";
import { upload, deleteImageByUrl, createGuide, updateGuide, getGuides, getGuidesPerType, getGuide, getUserGuides, deleteGuide, updateGuideStatus, addFeedback, getFeedback, getUserFeedback, getAllComments, hideFeedback, handleBookmark, isBookmarked, deleteRating, getGuidesAccepted, getUserAndGuideBaseOnSearch, getBookmarkedGuides, getLatestGuides, getUserGuidesAccepted, getMonthlyGuideCountsByYear, searchedTools } from "../controller/guide.controller.js";

const guideRouter = Router();

guideRouter.post('/search-tools', searchedTools);
guideRouter.post('/monthly', getMonthlyGuideCountsByYear);
guideRouter.post('/search', getUserAndGuideBaseOnSearch)
guideRouter.post('/bookmark', handleBookmark);
guideRouter.post('/is-bookmarked', isBookmarked);
guideRouter.post('/get-bookmarked-guides', getBookmarkedGuides)
guideRouter.post('/edit-guide', updateGuide);
guideRouter.post('/upload', upload);
guideRouter.post('/deleteImage', deleteImageByUrl);
guideRouter.post('/create', createGuide);
guideRouter.get('/', getGuides);
guideRouter.get('/accepted', getGuidesAccepted);
guideRouter.post('/pertype', getGuidesPerType);
guideRouter.post('/latest', getLatestGuides);
guideRouter.get('/user-guides/:_id', getUserGuides);
guideRouter.get('/user-guides-accepted/:_id', getUserGuidesAccepted);
guideRouter.post('/addFeedback', addFeedback);
guideRouter.post('/delete-rating', deleteRating)
guideRouter.put('/guideStatus/:_id', updateGuideStatus);
guideRouter.get('/getFeedback/:_id', getFeedback);
guideRouter.get('/getUserFeedback/:_id', getUserFeedback);
guideRouter.get('/getAllComments', getAllComments);
guideRouter.put('/hideFeedback/:_id', hideFeedback);
guideRouter.get('/:_id', getGuide);
guideRouter.post('/:_id', deleteGuide);

export default guideRouter;