import { Router } from "express";
import {  getUserData, getAllUsers, editUserData, getAllUsersData } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get('/all', getAllUsersData)
userRouter.get('/:_id', getUserData);
userRouter.get('/', getAllUsers);
userRouter.put('/:_id', editUserData);

export default userRouter;