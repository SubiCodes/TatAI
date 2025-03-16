import { Router } from "express";
import { createPreference, getPreference, updatePreference } from "../controller/preference.controller.js";

const preferenceRouter = Router();

preferenceRouter.get('/:_id', getPreference);
preferenceRouter.post('/', createPreference);
preferenceRouter.put('/:id', updatePreference);

export default preferenceRouter;