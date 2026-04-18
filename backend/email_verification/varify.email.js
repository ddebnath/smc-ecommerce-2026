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

// import dotenv from "dotenv";
// import { Resend } from "resend";

// dotenv.config();

// const resend = new Resend(`${process.env.RESEND_API_KEY}`);

// export const verifyEmail = async (token, email) => {
//   const recipient = String(email || "").trim();

//   const link = `${process.env.FRONTEND_URL}/auth/verify/${token}`;

//   if (!recipient) {
//     throw new Error("Recipient email is required");
//   }

//   try {
//     const result = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: recipient,
//       subject: "Verify your email",
//       text: `Verify your email by visiting: ${link}`,
//       html: `<p>Please click the link below to verify your email:</p><a href="${link}">Verify Email</a>`,
//     });

//     console.log("Email sent to:", recipient, "resend result:", result);
//     console.log(
//       "Resolved messageId:",
//       result.id ?? result.messageId ?? result.message_id,
//     );
//     return result;
//   } catch (error) {
//     console.error("Error sending email to:", recipient, error);
//     throw new Error(
//       `Failed to send email to ${recipient}: ${error.message || error}`,
//     );
//   }
// };

import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const verifyEmail = async (token, email) => {
  const recipient = String(email || "").trim();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${frontendUrl}/auth/verify/${token}`;

  if (!recipient) {
    throw new Error("Recipient email is required");
  }
  if (!token) {
    throw new Error("Verification token is required");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: recipient,
    subject: "Verify your email",
    text: `Verify your email by visiting: ${link}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2>Email Verification</h2>
        <p>Please click the button below to verify your email address.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">Verify Email</a>
        <p>If the button does not work, copy and paste this URL into your browser:</p>
        <p><a href="${link}" style="color:#2563eb;">${link}</a></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to:", recipient, "info.response:", info.response);
  } catch (error) {
    console.error("Error sending email to:", recipient, error);
    throw new Error(
      `Failed to send verification email: ${error.message || error}`,
    );
  }
};
