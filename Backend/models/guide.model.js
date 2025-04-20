import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo',
        required: true
    },
    uploader: {
        type: String,
        required: true
    },
    uploaderName: {
        type: String,
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
    toolsNeeded: {
        type: [String],
        required: false
    },
    materialsNeeded: {
        type: String,
        required: false
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
    closingMessage: {
        type: String,
        default: "",
        required: true
    },
    additionalLink: {
        type: String,
        required: false
    },
    feedBack:{
        type: [{user:String, comment: String, rating: Number}],
        required: false
    }
}, {
    collection: 'Guides',
    timestamps: true
});

const Guide = mongoose.model("Guide", guideSchema);

export default Guide;