import NewsLetter from "../models/Newsletter.js";
import { sendOtpEmail } from "../utilities/sendOtpEmail.js";
// Receive a newsletter subscription email
// and send a confirmation email to the user

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email is already subscribed
    const existingSubscription = await NewsLetter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: "Email already subscribed" });
    }
    // Save the email to the database
    const newSubscription = new NewsLetter({ email });
    await newSubscription.save();
    // Send a confirmation email to the user
    const subject = "Newsletter Subscription Confirmation";
    const message = `
Hi,

Thank you for subscribing to the MireDigital newsletter!

You'll now receive the latest updates, exclusive offers, and insights directly to your inbox.

If you have any questions or wish to unsubscribe at any time, just reply to this email.

Welcome to the community!

Best regards,
The MireDigital Team
`;
    await sendOtpEmail(email, subject, message);
    res.status(200).json({ message: "Subscribed to newsletter" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
