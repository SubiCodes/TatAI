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
    // Get the public_id from the request body
    const { public_id } = req.body;  
    console.log('Received public_id:', public_id);
  
    // Check if the public_id is provided
    if (!public_id) {
      return res.status(400).json({ error: 'Public ID is required' });
    }
  
    // Delete the image from Cloudinary using the public_id
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Cloudinary deletion result:', result);
  
    // If deletion is successful, return a success message
    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      // If deletion fails, return an error message with details
      res.status(200).json({ error: 'Failed to delete image', details: result });
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
    const latestGuides = await Guide.find().sort({ updatedAt: -1 });

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
    
    const posterMap = {};
    posters.forEach(poster => {
      posterMap[poster._id.toString()] = {
        name: `${poster.firstName} ${poster.lastName}`,
        profileIcon: poster.profileIcon
      };
    });
    
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

export const getGuidesPerType = async (req, res) => {
  try {
    const { type, amount } = req.body;
    const latestGuides = await Guide.find({type: type, status: 'accepted'}).limit(amount);

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
    
    const posterMap = {};
    posters.forEach(poster => {
      posterMap[poster._id.toString()] = {
        name: `${poster.firstName} ${poster.lastName}`,
        profileIcon: poster.profileIcon
      };
    });
    
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



export const getUserGuides = async (req, res) => {
  try {
    const { _id } = req.params; // Assuming the userID is passed as a route parameter

    // Find guides based on the filter
    const latestGuides = await Guide.find({ userID: _id }).sort({ updatedAt: -1 });
    
    // If no guides found, return an empty array
    if (latestGuides.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: [] 
      });
    }
    
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

    // Check if feedback already exists
    let existingFeedback = await Feedback.findOne({ guideId, userId });

    if (existingFeedback) {
      if (comment === undefined && rating !== undefined) {
        // Only update rating, without changing timestamps
        existingFeedback.rating = rating;
        await existingFeedback.save({ timestamps: false });

        return res.status(200).json({
          success: true,
          message: "Feedback rating updated without modifying timestamp.",
          data: existingFeedback,
        });
      }

      if (comment !== undefined || rating !== undefined) {
        // Update either or both fields safely
        if (comment !== undefined) existingFeedback.comment = comment;
        if (rating !== undefined) existingFeedback.rating = rating;

        await existingFeedback.save(); // Updates updatedAt

        return res.status(200).json({
          success: true,
          message: "Feedback updated successfully.",
          data: existingFeedback,
        });
      }
    }

    // Creating new feedback — at least one of comment or rating is required
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
          return res.status(200).json({ success: true, data: [] });
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

export const getUserFeedback = async (req, res) => {
  const { _id } = req.params; // only userId is needed now
  try {
    // Get all feedbacks for the specific user that have a comment
    const feedback = await Feedback.find({
      userId: _id,
      comment: { $exists: true, $ne: "" } // comment must exist and not be empty
    }).sort({ updatedAt: -1 });

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ success: false, error: "Feedback not found" });
    }

    // Fetch user information once
    const user = await UserInfo.findById(_id, 'firstName lastName profileIcon email');

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Add user info to each feedback
    const feedbackWithUser = feedback.map(fb => {
      const fbObj = fb.toObject();
      return {
        ...fbObj,
        userInfo: {
          name: `${user.firstName} ${user.lastName}`,
          profileIcon: user.profileIcon,
          email: user.email
        }
      };
    });

    res.status(200).json({ success: true, data: feedbackWithUser });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
};

export const getAllComments = async (req, res) => {
  try {
    // Get all feedbacks that have a comment, sorted by newest first
    const feedbacks = await Feedback.find({
      comment: { $exists: true, $ne: "" }
    }).sort({ updatedAt: -1 });

    // If no feedbacks with comments exist, return empty data array
    if (!feedbacks || feedbacks.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Handle single feedback or multiple feedbacks
    const userIds = [...new Set(feedbacks.map(feedback => 
      feedback.userId ? feedback.userId.toString() : null
    ).filter(id => id !== null))];

    // If no valid userIds were found
    if (userIds.length === 0) {
      const feedbacksWithoutUsers = feedbacks.map(feedback => ({
        ...feedback.toObject(),
        userInfo: { name: "Unknown User", profileIcon: "", email: "" }
      }));
      return res.status(200).json({ success: true, data: feedbacksWithoutUsers });
    }

    // Fetch all relevant users in one query
    const users = await UserInfo.find(
      { _id: { $in: userIds } },
      'firstName lastName profileIcon email'
    );

    // Create a map of users for quick lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = {
        name: `${user.firstName} ${user.lastName}`,
        profileIcon: user.profileIcon,
        email: user.email
      };
    });

    // Add user info to each feedback
    const feedbacksWithUserInfo = feedbacks.map(feedback => {
      const feedbackObj = feedback.toObject();
      const userId = feedback.userId ? feedback.userId.toString() : null;
      
      return {
        ...feedbackObj,
        userInfo: userId && userMap[userId] 
          ? userMap[userId] 
          : { name: "Unknown User", profileIcon: "", email: "" }
      };
    });

    res.status(200).json({ success: true, data: feedbacksWithUserInfo });
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
};

export const updateGuide = async (req, res) => {
  try {
    const { guideID, userID, ...updatedFields } = req.body;
    console.log(guideID)
    const guide = await Guide.findById(guideID);
    const user = await UserInfo.findById(userID);

    if (!guide) return res.status(404).json({ success: false, error: "Guide not found" });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    Object.keys(updatedFields).forEach(key => {
      guide[key] = updatedFields[key] || guide[key];
    });

    const updatedGuide = await guide.save();
    res.status(200).json({ success: true, guide: updatedGuide });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
};