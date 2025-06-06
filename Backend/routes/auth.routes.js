import { Router } from "express";
import { signUp, verifyUser , resendVerificationToken, signIn, signInAdmin, getCookie, deleteCookie, forgotPassword, getResetToken, resetPassword, resendToken, changePassword } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/verify-user', verifyUser);

authRouter.post('/resend-verification-token', resendVerificationToken);

authRouter.post('/sign-in', signIn);

authRouter.get('/get-cookie', getCookie);

authRouter.post('/delete-cookie', deleteCookie);

authRouter.post('/sign-in-admin', signInAdmin);

authRouter.post('/forgot-password', forgotPassword);

authRouter.post('/get-reset-token', getResetToken);

authRouter.post('/resend-reset-password-token', resendToken);

authRouter.post('/reset-password', resetPassword);

authRouter.post('/change-password/:_id', changePassword);


export default authRouter;