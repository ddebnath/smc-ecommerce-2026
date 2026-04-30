// import dotenv from "dotenv";
// import { Resend } from "resend";

// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const verifyEmail = async (token, email) => {
//   const recipient = String(email || "").trim();

//   if (!recipient) {
//     throw new Error("Recipient email is required");
//   }

//   if (!token) {
//     throw new Error("Verification token is required");
//   }

//   const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

//   const link = `${frontendUrl}/auth/verify/${token}`;

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: recipient,
//       subject: "Verify your email",
//       text: `Verify your email by visiting: ${link}`,
//       html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2>Email Verification</h2>
//         <p>Please click the button below to verify your email:</p>

//         <a href="${link}"
//            style="display:inline-block;padding:12px 20px;
//                   background:#2563eb;color:#fff;
//                   border-radius:6px;text-decoration:none;">
//           Verify Email
//         </a>

//         <p style="margin-top:15px;">
//           Or copy this link:<br/>
//           <a href="${link}">${link}</a>
//         </p>
//       </div>
//     `,
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       throw new Error(error.message);
//     }

//     console.log("Email sent successfully:", data?.id);

//     return data; // optional
//   } catch (error) {
//     console.error("Error sending email:", error?.message, error);
//     throw new Error(
//       `Failed to send email to ${recipient}: ${error.message || error}`,
//     );
//   }
// };

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
