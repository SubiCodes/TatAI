import { Router } from "express";
import {  getUserData, getAllUsers, editUserData, getAllUsersData, sendUserConcern } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.post('/concern', sendUserConcern)
userRouter.get('/all', getAllUsersData)
userRouter.get('/:_id', getUserData);
userRouter.get('/', getAllUsers);
userRouter.put('/:_id', editUserData);

export default userRouter;