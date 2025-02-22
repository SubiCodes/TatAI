import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

export const signUp = async (req, res) => {
    const {name, email, password} = req.body;

    const checkExists = await User.findOne({email: email});
    
    if (checkExists) {
        return res.status(400).json({success: false, message: "Email already exists."});
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({name: name,email: email, password: encryptedPassword});
        res.status(201).json({success: true, message: "User created successfully.", data: user});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Cannot create user."});
    }
};

export const signIn = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email: email});

    if (!existingUser) {
        return res.status(404).json({success: false, message: "User not found."});
    }

    if (await bcrypt.compare(password, existingUser.password)) {
        const token = JWT.sign({ email: existingUser.email }, JWT_SECRET);

        if (res.status(201)){
            return res.send({success: true, message: "User logged in successfully.", data: token});
        }
        else{
            return res.status(401).json({success: false, message: "Invalid User Credentials."});
        }
    }
};

