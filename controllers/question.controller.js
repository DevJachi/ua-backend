import Question from "../models/questions.model.js";
import Exam from "../models/exam.model.js";

export const createQuestion = async (req, res) => {
  const { title, options, correctAnswer } = req.body;
  const { examId } = req.params;
  try {
    if (!title || !options || !correctAnswer || !examId) {
      return res.send("All Parameters Required");
    }
    const questionAlreadyExists = await Question.findOne({ title });
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res
        .status(400)
        .json({ success: false, msg: "Exam Does Not Exist" });
    }

    if (questionAlreadyExists) {
      res.status(409).json({ msg: "Question Already Exists IN this Exam" });
    }
    const question = new Question({
      title,
      options,
      exam: exam._id,
      correctAnswer,
    });
    await question.save();

    res.json({
      success: true,
      msg: "Question Created Successfully",
      question: {
        title,
        options,
        correctAnswer,
        exam,
      },
    });
  } catch (error) {
    console.log("questions", error);
    res.json({ success: false, error: error.message });
  }
};
