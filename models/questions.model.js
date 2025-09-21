import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    require: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  correctAnswer: {
    type: String,
    min: 1,
    required: true,
  },
});

export default mongoose.model("Question", questionSchema);
