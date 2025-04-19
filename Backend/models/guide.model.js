import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo',
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "rejected", "accepted"],
    },
    type: {
        type: String,
        enum: ["repair", "tool", "diy", "cooking"],
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverImg: {
        type: String,
        default: "",
        required: true
    },
    stepTitles: {
        type: [String],
        default: [],
        required: true
    },
    stepDescriptions: {
        type: [String],
        default: [],
        required: true
    },
    stepImg: {
        type: [String],
        default: [],
        required: true
    },
}, {
    collection: 'Guides',
    timestamps: true
});

const Guide = mongoose.model("UserInfo", guideSchema);

export default Guide;