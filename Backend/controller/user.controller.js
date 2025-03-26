import User from "../models/user.model.js";
import UserPreference from "../models/preference.model.js";


export const getUserData = async (req, res) => {

    const {_id} = req.params;

    try {
        const user = await User.findOne({_id: _id}).select("email firstName lastName gender birthday verificationToken verified profileIcon");

        if (!user) {
            return res.status(404).json({success: false, message: "User does not exist."})
        }

        return res.status(200).json({success: true, message: "User data fethced successfully", data: user})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Cant get user data.", error: error.message})
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
}