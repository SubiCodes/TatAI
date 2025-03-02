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
        required: true
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