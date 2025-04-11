import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Non-Binary", "Prefer not to say"],
        required: true
    },
    birthday: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();  // Ensures the date is not in the future
            },
            message: "Birthday must be a date in the past."
        }
    },
    profileIcon:{
        type: String,
        default: "empty_profile",
        enum: ['empty_profile', 'boy_1', 'boy_2', 'boy_3', 'boy_4', 'girl_1', 'girl_2', 'girl_3', 'girl_4', 'lgbt_1', 'lgbt_2', 'lgbt_3', 'lgbt_4'],
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        required: true
    },
    verificationToken: {
        type: String,
        default: undefined
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordTokenRequestCount: {
        type: Number,
        default: undefined
    },
    resetPasswordTokenRequestLatest: {
        type: Date,
        default: undefined
    },
}, {
    collection: 'UserInfo',
    timestamps: true
});

const User = mongoose.model("UserInfo", userSchema);

export default User;