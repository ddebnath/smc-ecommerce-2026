// import nodemailer from "nodemailer";
// import "dotenv/config";

// /*
//   step 1: The verifyEmail function is responsible for sending an email verification link to
//   the user's email address.
//   step 2: It takes a token and an email address as parameters, creates a transporter object
//   using nodemailer with Gmail service and authentication details from environment variables.
//   step 3: It then defines the mail configurations, including the sender's email, recipient's
//   email, subject, and the body of the email which contains a verification link with the token.
//   step 4: Finally, it sends the email using the transporter.sendMail method and logs a success
//   message if the email is sent successfully. If there is an error during this process, it
//   throws an error.
// */

// export const verifyEmail = async (token, email) => {
//   try {
//     // Create transporter

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       requireTLS: true, // ensure TLS is used
//       logger: true, // enable logging for debugging
//       debug: true, // include SMTP traffic in logs

//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASSWORD,
//       },
//     });

//     // Frontend URL (for verification link)
//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

//     const verificationLink = `${frontendUrl}/auth/verify/${token}`;

//     // Mail content
//     const mailOptions = {
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: "Verify Your Email",

//       // plain text (fallback)
//       text: `Click the link to verify your email: ${verificationLink}`,

//       // better UI

//       html: `
//         <h2>Email Verification</h2>
//         <p>Please click the button below to verify your email:</p>
//         <a href="${verificationLink}"
//            style="padding:10px 20px; background:#4CAF50; color:#fff; text-decoration:none;">
//            Verify Email
//         </a>
//         <p>If you did not request this, ignore this email.</p>
//       `,
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent:", info.response);

//     return info;
//   } catch (error) {
//     console.error(" Email error:", error.message);
//     throw new Error("Failed to send verification email");
//   }
// };

import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (token, email) => {
  try {
    console.log("resend api key", process.env.RESEND_API_KEY);

    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify/${token}`;

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // default test sender
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};
