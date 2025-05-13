import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME } from '../config/env.js';
import { CLOUDINARY_API_KEY } from '../config/env.js';
import { CLOUDINARY_SECRET_KEY } from '../config/env.js';

import UserInfo from '../models/user.model.js';
import Guide from '../models/guide.model.js';
import Feedback from '../models/feedback.model.js';
import Bookmark from '../models/bookmark.model.js'

import {sendGuideStatusUpdate} from '../nodemailer/email.js'

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
            resource_type: 'auto',
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
    const { images } = req.body; // Expecting an array of { url, public_id }

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    const deletionResults = [];

    for (const { public_id, url } of images) {
      if (!public_id || !url) {
        deletionResults.push({ public_id, url, result: 'skipped', reason: 'Missing public_id or url' });
        continue;
      }

      let resource_type = 'image'; // Default fallback

      if (url.includes('/video/')) {
        resource_type = 'video';
      }

      const result = await cloudinary.uploader.destroy(public_id, { resource_type });
      console.log(`Deleting ${resource_type}:`, result);

      deletionResults.push({
        public_id,
        url,
        result: result.result,
      });
    }

    res.json({ message: 'Deletion completed', results: deletionResults });

  } catch (error) {
    console.error('Server error during deletion:', error);
    res.status(500).json({ error: 'Server error while deleting media' });
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

export const getGuidesAccepted = async (req, res) => {
  try {
    const latestGuides = await Guide.find({status: 'accepted'}).sort({ updatedAt: -1 });

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

export const getUserGuidesAccepted = async (req, res) => {
  try {
    const { _id } = req.params; // Assuming the userID is passed as a route parameter

    // Find guides based on the filter
    const latestGuides = await Guide.find({ userID: _id, status: "accepted" }).sort({ updatedAt: -1 });
    
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
        await sendGuideStatusUpdate(guide.title, status, guide.uploader);
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
        
        existingFeedback.createdAt = Date.now();
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

export const deleteRating = async (req ,res) => {
  try {
    const {guideId, userId} = req.body
    let existingFeedback = await Feedback.findOne({ guideId, userId });
    if (!existingFeedback) {
      return res.status(404).json({success: false, message: "Feedback not found"})
    }
    existingFeedback.rating = undefined;
    await existingFeedback.save();
    return res.status(200).json({success: true, message: "Successfully deleted rating", data: existingFeedback})
  } catch (error) {
    console.error("Error adding feedback:", error);
    console.error("Error adding feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding feedback",
      error: error.toString(),
  })}
};



export const getFeedback = async (req, res) => {
  const { _id } = req.params;
  try {
      // Get all feedback for the guide
      const feedback = await Feedback.find({ guideId: _id }).sort({ createdAt: -1 });

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
    }).sort({ createdAt: -1 });

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
    const { guideID, userID, deletedImagePublicIds = [], deletedVideoPublicIds = [], ...updatedFields } = req.body;
    const guide = await Guide.findById(guideID);
    const user = await UserInfo.findById(userID);

    if (!guide) return res.status(404).json({ success: false, error: "Guide not found" });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    // Handle deleting any removed images
    for (const public_id of deletedImagePublicIds) {
      await cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
    }

    // Handle deleting any removed videos
    for (const public_id of deletedVideoPublicIds) {
      await cloudinary.uploader.destroy(public_id, { resource_type: 'video' });
    }

    // Handle new uploads
    if (req.files) {
      // Handle cover image
      if (req.files.coverPhoto) {
        if (guide.coverImg?.public_id) {
          // Delete the old cover image from Cloudinary
          await cloudinary.uploader.destroy(guide.coverImg.public_id, { resource_type: 'image' });
        }
        const uploadedCover = await cloudinary.uploader.upload(req.files.coverPhoto.path, { resource_type: 'image' });
        updatedFields.coverImg = { url: uploadedCover.secure_url, public_id: uploadedCover.public_id };
      }

      // Handle step images or videos
      if (req.files.stepFiles && Array.isArray(req.files.stepFiles)) {
        updatedFields.stepImg = [];

        // Process each file (either image or video)
        for (const stepFile of req.files.stepFiles) {
          const uploadResult = await cloudinary.uploader.upload(stepFile.path, {
            resource_type: stepFile.mimetype.startsWith('video/') ? 'video' : 'image',
          });

        updatedFields.stepImg.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          mimeType: stepFile.mimetype, // Include the MIME type
        });
        }
      }
    }

    // Update the guide with new fields
    Object.keys(updatedFields).forEach((key) => {
      guide[key] = updatedFields[key] || guide[key];
    });

    const updatedGuide = await guide.save();
    res.status(200).json({ success: true, guide: updatedGuide });

  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
};
export const handleBookmark = async (req, res) => {
  try {
    const {guideId, userId} = req.body;
    const bookmark = await Bookmark.findOne({guideId: guideId, userId: userId});
    if (!bookmark) {
      const results = await Bookmark.create({ userId, guideId });
      return res.status(200).json({ success: true, message: "created", data: {guideId, userId, results} });
    };
    const results = await Bookmark.deleteOne({ userId, guideId });
    return res.status(200).json({ success: true, message: "deleted", data: {guideId, userId, results} });
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
};

export const isBookmarked = async (req, res) => {
  try {
    const {guideId, userId} = req.body;
    const bookmark = await Bookmark.findOne({guideId: guideId, userId: userId});
    if (!bookmark) {
      return res.status(200).json({ success: true, message: "Guide is not bookmarked", isBookmarked: false});
    };
    return res.status(200).json({ success: true, message: "Guide is bookmarked", isBookmarked: true});
  } catch (error) {
    res.status(500).json({ success: false, error: `Error: ${error.message}` });
  }
};


export const getUserAndGuideBaseOnSearch = async (req, res) => {
  const { query } = req.body;  // Extract the search query from request body

  try {
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search for users whose name matches the search query (case-insensitive)
    const users = await UserInfo.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$firstName', ' ', '$lastName'] },
              regex: query,
              options: 'i'
            }
          }
        }
      ]
    });

    // Search for guides whose title matches the search query (case-insensitive)
    const guides = await Guide.find({
      title: { $regex: query, $options: "i" },
      status: "accepted"
    });

    // Find all users whose IDs match those in the guides (for poster info)
    const userIds = guides.map(guide => guide.userID);
    const posters = await UserInfo.find({ _id: { $in: userIds } }, 'firstName lastName profileIcon');
    
    const guideIds = guides.map(guide => guide._id);
    const allFeedback = await Feedback.find({ guideId: { $in: guideIds } });

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
    
    // Map user info to guides
    const posterMap = {};
    posters.forEach(poster => {
      posterMap[poster._id.toString()] = {
        name: `${poster.firstName} ${poster.lastName}`,
        profileIcon: poster.profileIcon
      };
    });
    
    // Map the guide data to include user info and feedback info
    const guidesWithData = guides.map(guide => {
      const guideObj = guide.toObject();
      const userIdStr = guide.userID.toString();
      const guideIdStr = guide._id.toString();
      
      return {
        ...guideObj,
        posterInfo: posterMap[userIdStr] || null,
        feedbackInfo: feedbackMap[guideIdStr] || { averageRating: 0, commentCount: 0, ratingCount: 0 }
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        guides: guidesWithData  // This maintains the guides as a property within data
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBookmarkedGuides = async (req, res) => {
  try {
    const { userId } = req.body;

    const bookmarks = await Bookmark.find({ userId });

    if (!bookmarks || bookmarks.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const guideIds = bookmarks.map(bookmark => bookmark.guideId);
    const guides = await Guide.find({ _id: { $in: guideIds }, status: 'accepted' });

    const userIds = guides.map(guide => guide.userID);
    
    const posters = await UserInfo.find(
      { _id: { $in: userIds } },
      'firstName lastName profileIcon'
    );

    const allFeedback = await Feedback.find({ guideId: { $in: guideIds } });

    // Map feedback per guide
    const feedbackMap = {};
    guideIds.forEach(guideId => {
      const guideFeedback = allFeedback.filter(fb => fb.guideId.toString() === guideId.toString());

      const commentCount = guideFeedback.filter(fb => fb.comment?.trim()).length;
      const ratingsOnly = guideFeedback.filter(fb => typeof fb.rating === 'number');
      const averageRating = ratingsOnly.length > 0
        ? ratingsOnly.reduce((sum, fb) => sum + fb.rating, 0) / ratingsOnly.length
        : 0;

      feedbackMap[guideId.toString()] = {
        averageRating: parseFloat(averageRating.toFixed(1)),
        commentCount,
        ratingCount: ratingsOnly.length
      };
    });

    // Map user data
    const posterMap = {};
    posters.forEach(poster => {
      posterMap[poster._id.toString()] = {
        name: `${poster.firstName} ${poster.lastName}`,
        profileIcon: poster.profileIcon
      };
    });

    // Attach feedback and poster info to guides
    const guidesWithData = guides.map(guide => {
      const guideObj = guide.toObject();
      const guideIdStr = guide._id.toString();
      const userIdStr = guide.userID.toString();

      return {
        ...guideObj,
        posterInfo: posterMap[userIdStr] || null,
        feedbackInfo: feedbackMap[guideIdStr] || {
          averageRating: 0,
          commentCount: 0,
          ratingCount: 0
        }
      };
    });

    return res.status(200).json({ success: true, data: guidesWithData });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLatestGuides = async (req, res) => {
    try {
      const { amount } = req.body;
      // Get the latest guides
      const latestGuides = await Guide.find({status: "accepted"})
        .sort({ updatedAt: -1 }) 
        .limit(amount);
      
      // Extract the userIDs and guideIDs
      const userIds = latestGuides.map(guide => guide.userID);
      const guideIds = latestGuides.map(guide => guide._id);
      
      // Find all users whose IDs match those in the guides
      const posters = await UserInfo.find({ _id: { $in: userIds } }, 'firstName lastName profileIcon');
      
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

export const getMonthlyGuideCountsByYear = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Invalid or missing year in request body' });
    }

    const parsedYear = parseInt(year);
    const start = new Date(`${parsedYear}-01-01`);
    const end = new Date(`${parsedYear + 1}-01-01`);

    const results = await Guide.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyCounts = Array(12).fill(0);
    results.forEach(({ _id, count }) => {
      monthlyCounts[_id - 1] = count;
    });

    return res.status(200).json({ success: true, data: monthlyCounts });

  } catch (error) {
    console.error('Error fetching monthly guide counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
