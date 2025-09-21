import { createGmailTransporter } from "../Mailers/passMailer.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendPassedEmail = async (to, user, exam) => {
  try {
    const transporter = await createGmailTransporter();

    const info = await transporter.sendMail({
      from: '"Ugwu Academy" <support@ugwuacademy.com>',
      to,
      subject: "🎉 Congratulations you passed your exam!!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background: #f4f4f4;">
          <div style="background: #fff; border-radius: 10px; padding: 0; max-width: 650px; margin: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">

            <!-- Banner Image (Full width, no border radius, bold) -->
            <img src="cid:congratsBanner" alt="Congratulations Banner" style="width: 100%; display: block; margin-bottom: 25px;" />

            <!-- Inner Content -->
            <div style="padding: 30px; text-align: left;">
              <p style="font-size: 18px; color: #333; margin: 0 0 15px;">
                Hi ${user}! 👋
              </p>
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px;">
                Congratulations on successfully passing your <b>${exam}</b> exam at <b>Ugwu Academy</b>! 🎓<br/>
                Your hard work, dedication, and persistence have truly paid off.
              </p>

              <p style="font-size: 14px; color: #666; margin: 0 0 25px;">
                Keep pushing forward — this success is just the beginning 🚀
              </p>

              <a href="https://ugwututorial.vercel.app/" style="display: inline-block; padding: 12px 24px; background: #1565c0; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                Visit Ugwu Academy
              </a>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "banner-img.png",
          path: path.join(__dirname, "../assets/banner-img.png"),
          cid: "congratsBanner",
        },
      ],
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
