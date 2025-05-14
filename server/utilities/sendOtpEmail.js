import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for account verification is ${otp}. Please use this OTP to complete your registeration process.\n\nIf you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error in sending email", error);
  }
};
