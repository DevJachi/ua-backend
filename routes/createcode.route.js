import express from "express";
import bcryptjs from "bcryptjs";
import AdminCode from "../models/admincode.model.js";
import { generateAdminValidation } from "../utils/generateAdminValidation.js";

const router = express.Router();

router.post("/admin-code", async (req, res) => {
  //Hashed Admin Verification Code
  const code = await bcryptjs.hash(generateAdminValidation(), 10);

  const normalCode = generateAdminValidation();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); //  60 minutes
  console.log("Generated code:", code);

  try {
    const newCode = await AdminCode.create({ code, expiresAt });
    res.status(201).json({ code: normalCode });
    console.log("Generated code:", normalCode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

export default router;
