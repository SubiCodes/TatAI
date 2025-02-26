import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
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
    verified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    verificationToken: {
        type: String,
        default: undefined
    },
}, {
    collection: 'UserInfo',
    timestamps: true
});

const User = mongoose.model("UserInfo", userSchema);

export default User;