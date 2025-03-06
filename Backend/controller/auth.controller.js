import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { sendMail } from '../nodemailer/email.js';

export const signUp = async (req, res) => {
    const {firstName, lastName, gender, birthday, email, password} = req.body;
    
    const checkExists = await User.findOne({email: email});
    
    if (checkExists) {
        return res.status(400).json({success: false, message: "Email already exists."});
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({firstName: firstName, lastName: lastName, gender: gender, birthday: birthday,email: email, password: encryptedPassword});
        const token = await JWT.sign({ userID: user._id }, JWT_SECRET);
        res.status(201).json({success: true, message: "User created successfully.", data: user, tokenCreated: token});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Cannot create user.", error: error.message});
    }
};

export const signIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        
        const existingUser = await User.findOne({email: email});

        if (!existingUser) {
            return res.status(404).json({success: false, message: "Invalid Email."});
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({success: false, message: "Invalid Password."});
        }

        const token = JWT.sign({ userID: existingUser._id }, JWT_SECRET);
        res.status(200).json({success: true, message: "User logged in successfully.", token: token});

    } catch (error) {
        return res.status(500).json({success: false, message: `Cannot login user: ${error.message}`});
    }
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const existingUser = await User.findOne({email: email});
        const currentTime = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000; 

        if (!existingUser) {
            return res.status(404).json({success: false, message: "User does not exist."});
        };

        if ( existingUser.resetPasswordTokenRequestLatest && currentTime - existingUser.resetPasswordTokenRequestLatest < twentyFourHoursInMs){
            if (existingUser.resetPasswordTokenRequestCount >= 5){
                return res.status(400).json({success: false, message: "Daily limit request for this email has been reached."});
            }
        }else {
            existingUser.resetPasswordTokenRequestCount = 0;
            await existingUser.save();
        }
    
        const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    
        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordTokenRequestCount += 1;
        existingUser.resetPasswordTokenRequestLatest = currentTime;
        await existingUser.save();

        //send email here
    
        return res.status(200).json({success: true, message: "Reset password token sent to email.", resetToken: existingUser.resetPasswordToken, resetPasswordTokenRequestCount: existingUser.resetPasswordTokenRequestCount, resetPasswordTokenRequestLatest: existingUser.resetPasswordTokenRequestLatest, userEmail: existingUser.email});

    } catch (error) {
        return res.status(500).json({success: false, message: `Cannot create reset token: ${error.message}`});
    }
};

export const resendToken = async (req, res) => {
    const {email, token} = req.body;

    try {
        const existingUser = await User.findOne({email: email});
        const currentTime = Date.now();
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        
        if (!existingUser){
            return res.status(404).json({success: false, message: "User does not exist."});
        }

        if ( existingUser.resetPasswordTokenRequestLatest && currentTime - existingUser.resetPasswordTokenRequestLatest < twentyFourHoursInMs){
            if (existingUser.resetPasswordTokenRequestCount >= 5){
                return res.status(400).json({success: false, message: "Daily limit request for this email has been reached."});
            }
        }else {
            existingUser.resetPasswordTokenRequestCount = 0;
            await existingUser.save();
        }

        sendMail(email, token);
        existingUser.resetPasswordTokenRequestCount += 1;
        existingUser.resetPasswordTokenRequestLatest = currentTime;
        await existingUser.save();

        return res.status(200).json({success: true, message: 'Successfully sent email.'})

    } catch (error) {
        return res.status(500).json({success: false, message: `Cannot resend: ${error.message}`});
    }
}

export const getResetToken = async (req, res) => {
    const {email} = req.body;
    try {
        const existingUser = await User.findOne({email: email});

        if (!existingUser) {
            return res.status(404).json({success: false, message: "User does not exist."});
        };

        return res.status(200).json({success: true, message: "Successfully fetched reset token", resetToken: existingUser.resetPasswordToken})

    }
    catch (error){
        return res.status(500).json({success: false, message: `Cannot access reset token: ${error.message}`});
    }
}

export const resetPassword = async (req, res) => {
    const {email, resetToken, newPassword} = req.body;

    try {
        const existingUser = await User.findOne({email: email, resetPasswordToken: resetToken.toUpperCase()});
        if (!existingUser) {
            return res.status(404).json({success: false, message: `No reset token found for ${email} or invalid token.`});
        }
        existingUser.password = await bcrypt.hash(newPassword, 10);
        existingUser.resetPasswordToken = undefined;
        existingUser.resetPasswordTokenRequestCount = undefined;
        existingUser.resetPasswordTokenRequestLatest = undefined;
        await existingUser.save();
        return res.status(200).json({success: true, message: "Password reset successfully."});
    } catch (error) {
        return res.status(500).json({success: false, message: `Cannot reset password: ${error.message}`});
    }
};

