import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME } from '../config/env.js';
import { CLOUDINARY_API_KEY } from '../config/env.js';
import { CLOUDINARY_SECRET_KEY } from '../config/env.js';

import UserInfo from '../models/user.model.js';
import Guide from '../models/guide.model.js';
import Feedback from '../models/feedback.model.js';

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY
  });

export const upload = async (req, res) => {
    try {
        const fileStr = req.body.data; // base64 encoded image
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: 'tataiUploads',
          });
          
        res.json({ 
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
      }
};

export const deleteImageByUrl = async (req, res) => {
    try {
      const { public_id } = req.body;  // Use public_id from the request body
      console.log('Received public_id:', public_id);
  
      // Delete the image from Cloudinary using the public_id
      const result = await cloudinary.uploader.destroy(public_id);
      console.log('Cloudinary deletion result:', result);
  
      if (result.result === 'ok') {
        res.json({ message: 'Image deleted successfully' });
      } else {
        res.status(400).json({ error: 'Failed to delete image', details: result });
      }
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error while deleting image' });
    }
  };

export const createGuide = async (req, res) => {
    try {
        const { userID, type, title, description, coverImg, toolsNeeded, materialsNeeded, stepTitles, stepDescriptions, stepImg, closingMessage, additionalLink } = req.body;
        let status = "pending";
        const user = await UserInfo.findById(userID);
        if (!user) {
            return res.status(404).json({success: false, error: "User not found"});
        };

        if (user.role !== "user") {
            status = "accepted";
        };

        const uploader = user.email;
        const uploaderName = user.firstName + " " + user.lastName;
        const newGuide = new Guide({
            userID,
            uploader,
            uploaderName,
            status,
            type,
            title,
            description,
            coverImg,
            toolsNeeded,
            materialsNeeded,
            stepTitles,
            stepDescriptions,
            stepImg,
            closingMessage,
            additionalLink
        });

        const savedGuide = await newGuide.save();
        res.status(201).json({success: true, guide: savedGuide});

    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
};

export const getGuide = async (req, res) => {
  const _id = req.params._id;
  try {
    // Get the single guide by ID
    const guide = await Guide.findById(_id);
    
    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }
    
    // Get the poster information
    const poster = await UserInfo.findById(guide.userID, 'firstName lastName profileIcon');
    
    // Fetch feedback data for this guide
    const allFeedback = await Feedback.find({ 
      guideId: guide._id, 
    });
    
    // Process feedback data
    // Count comments (feedback entries with non-empty comments)
    const commentCount = allFeedback.filter(fb => fb.comment && fb.comment.trim() !== '').length;
    
    // Calculate average rating (only for feedback entries with ratings)
    const ratingsOnly = allFeedback.filter(fb => typeof fb.rating === 'number');
    const averageRating = ratingsOnly.length > 0 
      ? ratingsOnly.reduce((sum, fb) => sum + fb.rating, 0) / ratingsOnly.length
      : 0;
    
    // Prepare the feedback info
    const feedbackInfo = {
      averageRating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal place
      commentCount,
      ratingCount: ratingsOnly.length
    };
    
    // Prepare poster info
    const posterInfo = poster ? {
      name: `${poster.firstName} ${poster.lastName}`,
      profileIcon: poster.profileIcon
    } : null;
    
    // Add the poster and feedback info to the guide
    const guideWithData = {
      ...guide.toObject(),
      posterInfo,
      feedbackInfo
    };

    return res.status(200).json({ success: true, data: guideWithData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getGuides = async (req, res) => {
  try {
    const latestGuides = await Guide.find()

    const userIds = latestGuides.map(guide => guide.userID);
    const guideIds = latestGuides.map(guide => guide._id);
    
    // Find all users whose IDs match those in the guides
    const posters = await UserInfo.find({ _id: { $in: userIds } }, 'firstName lastName profileIcon');
    
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

export const deleteGuide = async (req, res) => {
    const _id = req.params._id;
    try {
        
        await Feedback.deleteMany({ guideId: _id });
        const guide = await Guide.findByIdAndDelete(_id);
        if (!guide) {
            return res.status(404).json({success: false, error: "Guide not found"});
        };
        res.status(200).json({success: true, data: guide, message: "Guide deleted successfully"});
    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
};

export const updateGuideStatus = async (req, res) => {
    const { _id } = req.params;
    const { status } = req.body;
    try {
        const guide = await Guide.findById(_id);
        if (!guide) {
            return res.status(404).json({success: false, error: "Guide not found"});
        }
        guide.status = status;
        await guide.save();
        res.status(200).json({success: true, data: guide});
      } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
      }
}

export const addFeedback = async (req, res) => {
  try {
    const { guideId, userId, comment, rating } = req.body;

    if (!guideId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: guideId and userId are required",
      });
    }

    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    const guide = await Guide.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    let existingFeedback = await Feedback.findOne({ guideId, userId });

    if (existingFeedback) {
      // Case: User already gave a comment
      if (existingFeedback.comment && comment) {
        return res.status(400).json({
          success: false,
          message: "You have already commented on this guide.",
        });
      }

      // Case: Update existing feedback with missing field
      if (!existingFeedback.rating && rating !== undefined) {
        existingFeedback.rating = rating;
      }

      if (!existingFeedback.comment && comment) {
        existingFeedback.comment = comment;
      }

      await existingFeedback.save();

      return res.status(200).json({
        success: true,
        message: "Feedback updated successfully.",
        data: existingFeedback,
      });
    }

    // New feedback
    if (!comment && rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least a comment or a rating.",
      });
    }

    const newFeedback = await Feedback.create({
      guideId,
      userId,
      comment,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback added successfully.",
      data: newFeedback,
    });

  } catch (error) {
    console.error("Error adding feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding feedback",
      error: error.toString(),
    });
  }
};

export const getFeedback = async (req, res) => {
  const { _id } = req.params;
  try {
      // Get all feedback for the guide
      const feedback = await Feedback.find({ guideId: _id });

      if (!feedback || feedback.length === 0) {
          return res.status(404).json({ success: false, error: "Feedback not found" });
      }

      // Extract all unique user IDs from the feedback
      const userIds = [...new Set(feedback.map(fb => fb.userId))];
      
      // Fetch user information for all feedback authors in a single query
      // Now including email in the projection
      const users = await UserInfo.find(
          { _id: { $in: userIds } }, 
          'firstName lastName profileIcon email'
      );
      
      // Create a map for easy user lookup
      const userMap = {};
      users.forEach(user => {
          userMap[user._id.toString()] = {
              name: `${user.firstName} ${user.lastName}`,
              profileIcon: user.profileIcon,
              email: user.email
          };
      });
      
      // Add user information to each feedback entry
      const feedbackWithUsers = feedback.map(fb => {
          const fbObj = fb.toObject();
          const userIdStr = fb.userId.toString();
          
          return {
              ...fbObj,
              userInfo: userMap[userIdStr] || null
          };
      });

      res.status(200).json({ success: true, data: feedbackWithUsers });
  } catch (error) {
      res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
};

export const hideFeedback = async (req, res) => {
    const { _id } = req.params;
    
    try {
        const feedback = await Feedback.findById(_id);

        if (!feedback) {
            return res.status(404).json({ success: false, error: "Feedback not found" });
        }

        feedback.hidden = !feedback.hidden; // Toggle the hidden status
        await feedback.save();

        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, error: `Error: ${error.message}` });
    }
}