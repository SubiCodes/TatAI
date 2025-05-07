import { Router } from "express";
import { addSearchHistory, clearSearch, createPreference, getPreference, removeSearch, updatePreference } from "../controller/preference.controller.js";

const preferenceRouter = Router();

preferenceRouter.post('/add-search', addSearchHistory)
preferenceRouter.post('/remove-search', removeSearch)
preferenceRouter.post('/clear-search', clearSearch)
preferenceRouter.get('/:_id', getPreference);
preferenceRouter.post('/', createPreference);
preferenceRouter.put('/:id', updatePreference);

export default preferenceRouter;