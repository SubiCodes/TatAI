import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME } from '../config/env.js';
import { CLOUDINARY_API_KEY } from '../config/env.js';
import { CLOUDINARY_SECRET_KEY } from '../config/env.js';

import UserInfo from '../models/user.model.js';
import Guide from '../models/guide.model.js';

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
        const guides = await Guide.find({_id: _id});
        if (!guides) {
            return res.status(404).json({success: false, error: "Guide not found"});
        };
        res.status(200).json({success: true, data: guides});
    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
}

export const getGuides = async (req, res) => {
    try {
        const guides = await Guide.find({});
        res.status(200).json({success: true, data: guides});
    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
}

export const deleteGuide = async (req, res) => {
    const _id = req.params._id;
    try {
        const guide = await Guide.findByIdAndDelete(_id);
        if (!guide) {
            return res.status(404).json({success: false, error: "Guide not found"});
        };
        res.status(200).json({success: true, data: guide, message: "Guide deleted successfully"});
    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
}