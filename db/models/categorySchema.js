import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    metaKeywords: [String],
  },
  {
    timestamps: true,
  }
);

// Generate slug from title
categorySchema.pre("validate", function (next) {
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

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
