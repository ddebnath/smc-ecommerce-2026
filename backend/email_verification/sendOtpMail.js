import nodemailer from "nodemailer";
import "dotenv/config";

/*
  step 1: The verifyEmail function is responsible for sending an email verification link to
  the user's email address.
  step 2: It takes a token and an email address as parameters, creates a transporter object 
  using nodemailer with Gmail service and authentication details from environment variables.
  step 3: It then defines the mail configurations, including the sender's email, recipient's
  email, subject, and the body of the email which contains a verification link with the token.
  step 4: Finally, it sends the email using the transporter.sendMail method and logs a success
  message if the email is sent successfully. If there is an error during this process, it 
  throws an error.
*/
export const sendOtpMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailConfigurations = {
      // It should be a string of sender/server email
      from: process.env.MAIL_USER,

      to: email,

      // Subject of Email
      subject: "Password Reset OTP",

      // This would be the text of email body
      text: `Hi! There, You have recently visited 
             our website and entered your email.
             Please use the following OTP to reset your password
             ${otp}
             Thanks`,
    };

    const info = await transporter.sendMail(mailConfigurations);
    console.log("OTP Sent Successfully");
    console.log(info.response);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};
