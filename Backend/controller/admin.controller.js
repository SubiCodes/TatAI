import User from '../models/user.model.js';

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