import { Router } from "express";
import {  getUserData, editUserData } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get('/:_id', getUserData);
userRouter.put('/:_id', editUserData);

export default userRouter;