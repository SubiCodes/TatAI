import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import { sendVerificationToken } from '../nodemailer/email.js';

export const addAccount = async (req, res) => {
    const {firstName, lastName, gender, birthday, email, password, role} = req.body;
    
    let status = "Unverified";
    
    const checkExists = await User.findOne({email: email});
    
    if (checkExists) {
        return res.status(400).json({success: false, message: "Email already exists."});
    };

    if (!firstName || !lastName || !gender || !birthday || !email || !password || !role) {
        return res.status(400).json({success: false, message: "There is an empty field."});
    };

    if (role === "admin" || role === "super admin") {
        status = "Verified";
    };

    const verificationToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({firstName: firstName, lastName: lastName, gender: gender, birthday: birthday,email: email, password: encryptedPassword,status: status, role: role, verificationToken: verificationToken});
        if (status !== "Verified"){
            sendVerificationToken(email, verificationToken);
        };
        res.status(201).json({success: true, message: "User created successfully.", data: user, verificationToken: verificationToken});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Cannot create user.", error: error.message});
    }
};

export const deleteAccount = async (req, res) => {
    const { _id } = req.params;
  
    try {
        const user = await User.findOne({_id: _id});
  
        if (!user) {
            return res.status(404).json({success: false, message: "User not found.",});
        };
  
        await user.deleteOne();
  
        return res.status(200).json({ success: true, message: "User deleted successfully.", });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the user.",
        error: error.message,
        });
    }
};
  

export const changeStatus = async (req, res) => {
    const {_id} = req.params;
    const {action} = req.body;

    try {
        const user = await User.findOne({_id: _id});

        if(!user) {
            return res.status(404).json({success: false, message: "User not found."});
        };

        if(action !== "Restricted" && action !== "Banned" && action !== "Verified"  && action !== "Unverified") {
            return res.status(400).json({success: false, message: "Invalid action."});
        };

        user.status = action;
        user.save();

        return res.status(200).json({success: true, message: "User status updated successfully."});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Can't update user status.", error: error.message });
    }
};

export const checkUserRole = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).json({ success: false, message: "No token found" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, role: user.role });
  
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
    }
};

export const changeRole = async (req, res) => {
    const {_id} = req.params;
    const {role} = req.body;

    try {
        const user = await User.findOne({_id: _id});

        if(!user) {
            return res.status(404).json({success: false, message: "User not found."});
        };

        if(role !== "admin" && role !== "user") {
            return res.status(400).json({success: false, message: "Invalid role."});
        };

        user.role = role;
        user.save();

        return res.status(200).json({success: true, message: "User role updated successfully."});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Can't update user role.", error: error.message });
    }
};

export const getAdminData = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).json({ success: false, message: "No token found" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, data: user });
  
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
    }
};

export const editAdminData = async (req, res) => {
    const {_id} = req.params;
    const {firstName, lastName, gender, birthday, profileIcon} = req.body;
    
    try {
        const user = await User.findOne({_id: _id});

        if(!user){
            return res.status(404).json({success: false, message: "User does not exist.", userID: _id})
        }

        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(gender) user.gender = gender;
        if(birthday) user.birthday = birthday;
        if(profileIcon) user.profileIcon = profileIcon;

        await user.save();

        return res.status(200).json({success: true, message: "Admin information updated successfully", userInfo: user})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Cant update admin data.", error: error.message})
    }
}