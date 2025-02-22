import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    preferredName: {
        type: String,
        required: true
    },
    preferredTone: {
        type: String,
        enum: ["formal", "casual", "soft spoken", "strict"],
        required: true
    },
    previousPrompts: {
        type: [String],
        default: [] 
    }
}, {
    collection: "UserPreferences",
    timestamps: true
});

const UserPreference = mongoose.model("UserPreference", preferenceSchema);

export default UserPreference;