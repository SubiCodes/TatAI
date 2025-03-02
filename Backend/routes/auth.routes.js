import { Router } from "express";
import { signUp, signIn, forgotPassword, getResetToken, resetPassword, resendToken } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/get-reset-token', getResetToken);

authRouter.post('/resend-reset-password-token', resendToken);

authRouter.post('/reset-password', resetPassword);


export default authRouter;