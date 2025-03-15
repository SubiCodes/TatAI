import { Router } from "express";
import { editUserData } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.put('/:_id', editUserData);

export default userRouter;