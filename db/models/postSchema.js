import mongoose from "mongoose";

// Blog post schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    faqs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faqs",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    metaDescription: String,
    metaKeywords: [String],
    slug: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title
postSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);
  } else {
    this.slug = generateSlug(this.slug);
  }
  next();
});

// Function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
