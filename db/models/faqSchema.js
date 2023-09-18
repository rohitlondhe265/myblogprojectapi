const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
  },
});

const Faqs = mongoose.models.Faqs || mongoose.model("Faqs", faqSchema);

export default Faqs;
