import Exam from "../models/exam.model.js";

export const addExam = async (req, res) => {
  const { title, description, duration, passMark, createdAt } = req.body;
  try {
    if (!title || !description || !duration || !passMark) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Required" });
    }
    const examExists = await Exam.findOne({ title });

    if (examExists) {
      return res
        .status(400)
        .json({ success: false, message: "Exam Already Exists" });
    }

    const exam = new Exam({
      title,
      description,
      duration,
      passMark,
      createdBy: req.user,
      createdAt,
    });
    await exam.save();

    res.status(201).json({
      success: true,
      message: "Exam Created Succesfully",
      passMark,
      exam: {
        title: exam.title,
        description: exam.description,
        createdBy: req.user.email,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Exam Not Created",
      errorMsg: error.message,
    });
    throw error;
  }
};

export const getExam = async (req, res) => {
  console.log("To get exam");
};
