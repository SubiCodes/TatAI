import User from "../models/user.model.js";


export const getUserData = async (req, res) => {

    const {email} = req.params;

    try {
        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(400).json({success: false, message: "User does not exist."})
        }

        return res.status(200).json({success: true, message: "User data fethced successfully", data: user})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Cant get user data.", error: error.message})
    }
};