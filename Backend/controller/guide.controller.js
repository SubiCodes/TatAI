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

export const createGuide = async (req, res) => {
    try {
        const { userID, type, title, description, coverImg, toolsNeeded, materialsNeeded, stepTitles, stepDescriptions, stepImg, closingMessage, additionalLinks } = req.body;
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
            additionalLinks
        });

        const savedGuide = await newGuide.save();
        res.status(201).json({success: true, guide: savedGuide});

    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
};

export const getGuides = async (req, res) => {
    try {
        const guides = await Guide.find({});
        res.status(200).json({success: true, data: guides});
    } catch (error) {
        res.status(500).json({success: false, error: `Error: ${error.message}`});
    }
}