import User from "../models/user.model.js";
import UserPreference from "../models/preference.model.js";
import { sendConcern, sendReportEmail } from "../nodemailer/email.js";
import OpenAI from "openai";

const token = "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";

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: token,
});

export const getUserData = async (req, res) => {
  const { _id } = req.params;

  try {
    const user = await User.findOne({ _id: _id });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist." });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "User data fethced successfully",
        data: user,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Cant get user data.",
        error: error.message,
      });
  }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("email firstName lastName role gender birthday verificationToken status profileIcon");

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found." });
        }

        return res.status(200).json({ success: true, message: "Users fetched successfully", data: users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Can't get users data.", error: error.message });
    }
};

export const getAllUsersData = async (req, res) => {
    try {
        const users = await User.find()

        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found." });
        }

        return res.status(200).json({ success: true, message: "Users fetched successfully", data: users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Can't get users data.", error: error.message });
    }
};


export const editUserData = async (req, res) => {
    const {_id} = req.params;
    const {firstName, lastName, gender, birthday, preferredName, preferredTone, toolFamiliarity, skillLevel, profileIcon} = req.body;
    
    try {
        const user = await User.findOne({_id: _id});
        const preference = await UserPreference.findOne({userId: _id});

        if(!user){
            return res.status(404).json({success: false, message: "User does not exist.", userID: _id})
        }

        if(!preference){
            return res.status(404).json({success: false, message: "User does not have an existing preference.", preference: preference})
        }

        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(gender) user.gender = gender;
        if(birthday) user.birthday = birthday;
        if(profileIcon) user.profileIcon = profileIcon;

        if(preferredName) preference.preferredName = preferredName;
        if(preferredTone) preference.preferredTone = preferredTone;
        if(toolFamiliarity) preference.toolFamiliarity = toolFamiliarity;
        if(skillLevel) preference.skillLevel = skillLevel;

        await user.save();
        await preference.save();

        return res.status(200).json({success: true, message: "User information updated successfully", userInfo: user, userPreference: preference})

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Cant update user data.", error: error.message})
    }
};

export const sendUserConcern = async (req, res) => {
    try {
        const {email, message} = req.body;

        if (!email) {
            return res.status(400).json({success: false, message: "Email can't be empty."})
        };

        if (!message) {
            return res.status(400).json({success: false, message: "Message can't be empty."})
        };

        await sendConcern(email, message);
        return res.status(200).json({success: true, message: "Message sent."})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Cant send user email.", error: error.message})
    }
};

export const sendUserReport = async (req, res) => {
    try {
        const { from, type, guideTitle, comment, posterName } = req.body;

        if (!from) {
            return res.status(400).json({success: false, message: "Email can't be empty."})
        };

        if (!type) {
            return res.status(400).json({success: false, message: "Message can't be empty."})
        };

        if (!posterName) {
            return res.status(400).json({success: false, message: "Message can't be empty."})
        };

        await sendReportEmail({from, type, guideTitle, comment, posterName});
        return res.status(200).json({success: true, message: "Report sent."})
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: "Cant send user email.", error: error.message})
    }
};

export const callAi = async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await client.chat.completions.create({
      messages: messages,
      model: "openai/gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    return res.status(200).json({ success: true, message: response });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "AI response failed.",
      error: error.message,
    });
  }
};

