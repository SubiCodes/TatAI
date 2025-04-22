import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide', // Assuming you have a Guide model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  comment: {
    type: String,
    maxlength: 1000,
  },
  hidden: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Optional: prevent duplicate feedback per user per guide
feedbackSchema.index({ guideId: 1, userId: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;