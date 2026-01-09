import nodemailer from "nodemailer";

const sendEmailOtp = async (email, otp) => {
  try {
    // Create transporter (email service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //  Email content
    const mailOptions = {
      from: `"ECHO Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ECHO - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Your OTP for ECHO registration is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
    };

    //  Send email
    await transporter.sendMail(mailOptions);

    console.log(" OTP email sent successfully");
  } catch (error) {
    console.error(" Error sending OTP email:", error.message);
    throw new Error("OTP email failed");
  }
};

export default sendEmailOtp;
