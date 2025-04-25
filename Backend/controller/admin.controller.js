import User from '../models/user.model.js';
import Feedback from '../models/feedback.model.js';
import Guide from '../models/guide.model.js';
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
        // Find the user by ID
        const user = await User.findOne({ _id: _id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Delete all guides posted by the user
        await Guide.deleteMany({ userID: _id });

        // Delete all feedback posted by the user
        await Feedback.deleteMany({ userId: _id });

        // Finally, delete the user
        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "User and associated posts/feedbacks deleted successfully.",
        });
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
};

// dashboard data's

export const getCount = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments(); // total number of users
        const acceptedGuides = await Guide.countDocuments({ status: 'accepted' }); // guides with status 'accepted'
        const pendingGuides = await Guide.countDocuments({ status: 'pending' }); // guides with status 'pending'

        return res.status(200).json({
        success: true,
        data: {
            userTotal: totalUsers,
            liveGuides: acceptedGuides,
            pendingGuides: pendingGuides
        }
        });
    } catch (error) {
        return res.status(500).json({success: false, message: "Cant get count data for dashboard.", error: error.message});
    }
};

export const getLiveGuidesCount = async (req, res) => {
    try {
        const repair = await Guide.countDocuments({ type: 'repair' });
        const tool = await Guide.countDocuments({ type: 'tool' });
        const diy = await Guide.countDocuments({ type: 'diy' });
        const cooking = await Guide.countDocuments({ type: 'cooking' });
        
        return res.status(200).json({
        success: true,
        data: {
            repair: repair,
            tool: tool,
            diy: diy,
            cooking: cooking
        }
        });
    } catch (error) {
        return res.status(500).json({success: false, message: "Cant get live guide count data for dashboard.", error: error.message});
    }
};

export const getRatingsCount = async (req, res) => {
    try {
        const five = await Feedback.countDocuments({ rating: 5 });
        const four = await Feedback.countDocuments({ rating: 4  });
        const three = await Feedback.countDocuments({ rating: 3  });
        const two = await Feedback.countDocuments({ rating: 2  });
        const one = await Feedback.countDocuments({ rating: 1  });
        
        const totalCount = five + four + three + two + one;

        const average = totalCount === 0 
            ? 0 
            : ((5 * five + 4 * four + 3 * three + 2 * two + 1 * one) / totalCount).toFixed(2);

        const averageRaw = (5 * five + 4 * four + 3 * three + 2 * two + 1 * one) / totalCount;
        const roundedRating = Math.round(averageRaw * 2) / 2; // Round to nearest 0.5 

        return res.status(200).json({
        success: true,
        data: {
            five: five,
            four: four,
            three: three,
            two: two,
            one: one,
            average: average,
            roundedRating: roundedRating
        }
        });
    } catch (error) {
        return res.status(500).json({success: false, message: "Cant get live guide count data for dashboard.", error: error.message});
    }
};


export const getLatestFeedback = async (req, res) => {
    try {
        const latestFeedback = await Feedback.findOne({ comment: { $exists: true, $ne: "" } })
        .sort({ createdAt: -1 });

        if (!latestFeedback) {
            return;
        }

        // Fetch user information for the feedback author
        const user = await User.findById(latestFeedback.userId, 'firstName lastName profileIcon email');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Add user information to the feedback entry
        const feedbackWithUser = {
            ...latestFeedback.toObject(),
            userInfo: {
                name: `${user.firstName} ${user.lastName}`,
                profileIcon: user.profileIcon,
                email: user.email
            }
        };

        res.status(200).json({ success: true, data: feedbackWithUser });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getLatestGuides = async (req, res) => {
    try {
      // Get the latest guides
      const latestGuides = await Guide.find()
        .sort({ createdAt: -1 }) 
        .limit(2);
      
      // Extract the userIDs and guideIDs
      const userIds = latestGuides.map(guide => guide.userID);
      const guideIds = latestGuides.map(guide => guide._id);
      
      // Find all users whose IDs match those in the guides
      const posters = await User.find({ _id: { $in: userIds } }, 'firstName lastName profileIcon');
      
      // Fetch all feedback data for the guides
      const allFeedback = await Feedback.find({ 
        guideId: { $in: guideIds },
      });
      
      // Process feedback data manually
      const feedbackMap = {};
      
      guideIds.forEach(guideId => {
        const guideFeedback = allFeedback.filter(fb => fb.guideId.toString() === guideId.toString());
        
        // Count comments (feedback entries with non-empty comments)
        const commentCount = guideFeedback.filter(fb => fb.comment && fb.comment.trim() !== '').length;
        
        // Calculate average rating (only for feedback entries with ratings)
        const ratingsOnly = guideFeedback.filter(fb => typeof fb.rating === 'number');
        const averageRating = ratingsOnly.length > 0 
          ? ratingsOnly.reduce((sum, fb) => sum + fb.rating, 0) / ratingsOnly.length
          : 0;
        
        feedbackMap[guideId.toString()] = {
          averageRating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal place
          commentCount,
          ratingCount: ratingsOnly.length
        };
      });
      
      // Create user map for easy lookup
      const posterMap = {};
      posters.forEach(poster => {
        posterMap[poster._id.toString()] = {
          name: `${poster.firstName} ${poster.lastName}`,
          profileIcon: poster.profileIcon
        };
      });
      
      // Add the poster and feedback info to each guide
      const guidesWithData = latestGuides.map(guide => {
        const guideObj = guide.toObject();
        const userIdStr = guide.userID.toString();
        const guideIdStr = guide._id.toString();
        
        return {
          ...guideObj,
          posterInfo: posterMap[userIdStr] || null,
          feedbackInfo: feedbackMap[guideIdStr] || { averageRating: 0, commentCount: 0, ratingCount: 0 }
        };
      });
  
      return res.status(200).json({ success: true, data: guidesWithData });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
};