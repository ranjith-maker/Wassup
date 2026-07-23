import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_EMAIL_API);



export const sendOtptoEmail = async (email, otp) => {
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #075e54;">🔐 Wassup Web Verification</h2>

      <p>Hi there,</p>

      <p>Your one-time password (OTP) to verify your Wassup Web account is:</p>

      <h1 style="
        background:#e0f7fa;
        color:#000;
        padding:10px 20px;
        display:inline-block;
        border-radius:5px;
        letter-spacing:2px;
      ">
        ${otp}
      </h1>

      <p>
        <strong>This OTP is valid for the next 5 minutes.</strong>
      </p>

      <p>
        If you didn't request this OTP, please ignore this email.
      </p>

      <p>
        Thanks & Regards,<br/>
        Ranjith's Wassup Security Team
      </p>

      <hr/>

      <small style="color: #777;">
        This is an automated message. Please do not reply.
      </small>
    </div>
    `;

    try {
        const data = await resend.emails.send({
            // 🚀 Must use onboarding@resend.dev unless you have verified a custom domain
            from: "Wassup Support <ranjith@contact.wassupchat.online>",
            to: email,
            subject: "Ranjith's Wassup Verification OTP",
            html,
        });

        console.log("Email sent successfully via Resend:", data);
        return data;

    } catch (error) {
        console.error("Resend email error:", error?.response?.data || error.message || error);
        throw error;
    }
};

