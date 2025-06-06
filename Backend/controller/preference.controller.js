import UserPreference from "../models/preference.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getPreference = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    try {
        const preference = await UserPreference.findOne({ userId });
        if (!preference) {
            return res.status(200).json({ success: false, message: "User yet to set up preference not." });
        }
        res.status(200).json({ success: true, message: "Preference retrieved successfully.", data: preference });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot get user preference." });
    }
};

export const createPreference = async (req, res) => {
    const { userId, preferredTone, toolFamiliarity, skillLevel} = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    const checkExists = await UserPreference.findOne({ userId: userId });
    if(checkExists) {
        return res.status(400).json({ success: false, message: "User already have an existing preference." });
    }

    const user = await User.findById(userId);

    const preferredName = user.firstName;

    const validTones = ["formal", "casual", "soft spoken", "strict"];
    if (!validTones.includes(preferredTone)) {
        return res.status(400).json({ success: false, message: "Invalid preferred tone." });
    }

    const validToolFamiliarity = ["unfamiliar", "recognizes basics", "functionally knowledgeable", "knowledgeable", "expert"];
    if (!validToolFamiliarity.includes(toolFamiliarity)) {
        return res.status(400).json({ success: false, message: "Invalid Tool Familiarity." });
    }

    const validSkillLevel = ["beginner", "intermediate", "advance", "expert", "professional"];
    if (!validSkillLevel.includes(skillLevel)) {
        return res.status(400).json({ success: false, message: "Invalid Skill Level." });
    }

    try {
        const preference = await UserPreference.create({ userId: userId, email: user.email, preferredName: preferredName ,preferredTone: preferredTone, toolFamiliarity: toolFamiliarity, skillLevel: skillLevel });
        res.status(201).json({ success: true, message: "User preference created successfully.", data: preference });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot create user preference." });
    }
};

export const updatePreference = async (req, res) => {
    const { id } = req.params;
    const { preferredName, preferredTone, toolFamiliarity, skillLevel, previousPrompts } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID format." });
    }

    const validTones = ["formal", "casual", "soft spoken", "strict"];
    if (preferredTone && !validTones.includes(preferredTone)) {
        return res.status(400).json({ success: false, message: `Invalid preferred tone, choose between: ${validTones}` });
    }  
    
    const validToolFamiliarity = ["unfamiliar", "recognizes basics", "functionally knowledgeable", "knowledgeable", "expert"];
    if (toolFamiliarity && !validToolFamiliarity.includes(toolFamiliarity)) {
        return res.status(400).json({ success: false, message: "Invalid Tool Familiarity." });
    }

    const validSkillLevel = ["beginner", "intermediate", "advance", "expert", "professional"];
    if (skillLevel && !validSkillLevel.includes(skillLevel)) {
        return res.status(400).json({ success: false, message: "Invalid Skill Level." });
    }

    try {
        const preference = await UserPreference.findOne({ userId: id });
        if (!preference) {
            return res.status(404).json({ success: false, message: "User preference not found." });
        }

        if (preferredName) preference.preferredName = preferredName;
        if (preferredTone) preference.preferredTone = preferredTone;
        if (toolFamiliarity) preference.toolFamiliarity = toolFamiliarity;
        if (skillLevel) preference.skillLevel = skillLevel;
        if (Array.isArray(previousPrompts) && previousPrompts.length > 0) {
            preference.previousPrompts.push(...previousPrompts);
        }

        await preference.save();

        res.status(200).json({success: true, message: "User preference updated successfully.", data: preference});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot update user preference." });
    }
};

export const addSearchHistory = async (req, res) => {
    const { userId, search } = req.body;
  
    try {
      const preference = await UserPreference.findOne({ userId: userId });
  
      if (!preference) {
        return res.status(404).json({ success: false, message: "User preference not found." });
      }
  
      if (!search) {
        return res.status(400).json({ success: false, message: "Search term is required." });
      }
  
      // Remove search if it already exists
      preference.previousSearches = preference.previousSearches.filter(item => item !== search);
  
      // Add search to the top
      preference.previousSearches.unshift(search);
  
      // Optional: Limit to last 10 searches
      preference.previousSearches = preference.previousSearches.slice(0, 10);
  
      await preference.save();
  
      return res.status(200).json({
        success: true,
        message: "Search history updated successfully.",
        data: preference,
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Can't add search history.",
        error: error.message,
      });
    }
  };

  export const removeSearch = async (req, res) => {
    const { userId, search } = req.body;
  
    try {
      const preference = await UserPreference.findOne({ userId: userId });
  
      if (!preference) {
        return res.status(404).json({ success: false, message: "User preference not found." });
      }
  
      if (!search) {
        return res.status(400).json({ success: false, message: "Search term is required." });
      }
  
      // Remove the search term
      preference.previousSearches = preference.previousSearches.filter(item => item !== search);
  
      await preference.save();
  
      return res.status(200).json({
        success: true,
        message: "Search history updated successfully.",
        data: preference,
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Can't update search history.",
        error: error.message,
      });
    }
  };

  export const clearSearch = async (req, res) => {
    const { userId } = req.body;
  
    try {
      const preference = await UserPreference.findOne({ userId: userId });
  
      if (!preference) {
        return res.status(404).json({ success: false, message: "User preference not found." });
      }

      preference.previousSearches = [];
  
      await preference.save();
  
      return res.status(200).json({
        success: true,
        message: "Search history updated successfully.",
        data: preference,
      });
  
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: "Can't update search history.",
        error: error.message,
      });
    }
  };