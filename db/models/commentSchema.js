const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const Comments =
  mongoose.models.Comments || mongoose.model("Comments", commentSchema);

export default Comments;
