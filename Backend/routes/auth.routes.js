import { Router } from "express";
import { signUp, signIn } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);


export default authRouter;