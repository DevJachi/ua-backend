import Exam from "../models/exam.model.js";
import totalpointModel from "../models/totalpoint.model.js";
import { sendPassedEmail } from "../utils/sendPassedEmail.js";

export const totalpoints = async (req, res) => {
  const { totalPoint } = req.body;
  const { examId } = req.params;
  try {
    if (!examId || !totalPoint) {
      return res.send("Exam ID and total point needed");
    }
    const exam = await Exam.findById(examId);

    const passed = totalPoint > exam.passMark;
    console.log(
      `TotalPoint: ${totalPoint}, PassMark: ${exam.passMark}, Passed: ${passed}`
    );

    if (passed) {
      console.log("Passed exam, calling sendPassedEmail...");
      await sendPassedEmail(req.user.email, req.user.name, exam.title);
    } else {
      res.send("You did not pass");
      console.log("You did not pass");
    }

    const totalpoint = new totalpointModel({
      totalPoint,
      exam: examId,
      user: req.user,
    });

    await totalpoint.save();
    res.status(201).json({
      success: true,
      passMark: exam.passMark,
      data: totalpoint,
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
    console.log(error);
  }
};
