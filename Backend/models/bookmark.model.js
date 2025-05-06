import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guides',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo', 
    required: true,
  },
})

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;