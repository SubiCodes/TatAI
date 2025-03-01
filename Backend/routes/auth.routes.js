import { Router } from "express";
import { signUp, signIn, forgotPassword, resetPassword } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/reset-password', resetPassword);


export default authRouter;