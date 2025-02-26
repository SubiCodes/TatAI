import { Router } from "express";
import { getUserData } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get('/:email', getUserData);

export default userRouter;