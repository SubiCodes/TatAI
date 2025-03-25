import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    email: {
        type: String,
        ref: "User",
        required: true
    },
    profileIcon:{
        type: String,
        default: "empty_profile",
        enum: ['empty_profile', 'boy_1', 'boy_2', 'boy_3', 'boy_4', 'girl_1', 'girl_2', 'girl_3', 'girl_4', 'lgbt_1', 'lgbt_2', 'lgbt_3', 'lgbt_4'],
        required: false
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
    toolFamiliarity:{
        type: String,
        enum: ["unfamiliar", "recognizes basics", "functionally knowledgeable", "knowledgeable", "expert"],
        required: true
    },
    skillLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advance", "expert", "professional"],
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