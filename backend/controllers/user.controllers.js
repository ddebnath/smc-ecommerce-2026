import { verifyEmail } from "../email_verification/varify.email.js";
import { sendOtpMail } from "../email_verification/sendOtpMail.js";

import { Session } from "../models/session.models.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

// The user.controllers.js file contains the controller functions for handling user-related
// operations such as registration, email verification, re-verification, and login.
// Each function is responsible for processing the incoming request, performing the necessary
// operations (like interacting with the database), and sending an appropriate response back
// to the client. The functions are exported so that they can be used in the routes defined
// in user.routes.js.

export const register = async (req, res) => {
  try {
    // Destructure the required fields from the request body. If any of the fields are
    // missing, return a 400 Bad Request response with an appropriate error message.
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if a user with the provided email already exists in the database.
    // If such a user exists, return a 401 Unauthorized response.
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({ success: false, message: "user already exists" });
    }

    // If the user does not exist, create a new user in the database with the
    // provided first name, last name, email, and password. The password will
    // typically be hashed before being saved to the database for security reasons.
    // it will return the newly created user object, which includes the user's ID
    // and other details.

    const newUser = await User.create({ firstName, lastName, email, password });

    /*
      After creating the new user, we generate a JSON Web Token (JWT) for email verification.
      The token contains the user's ID and is signed with a secret key defined in the environment
      variables. The token is set to expire in 10 minutes. This token will be sent to the user's
      email for verification purposes, and it will also be stored in the database for future verification.
    */

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    /*
      The verifyEmail function is called to send an email to the user with the verification token.
      This function is responsible for sending an email to the user's email address with a link
      that includes the verification token. When the user clicks on the link, it will trigger
      the verification process, which will check the token against the one stored in the database
      and verify the user's email if the token is valid.
    */
    verifyEmail(token, email);

    /*
      The generated token is then saved in the user's record in the database. This allows us to
      verify the token later when the user clicks on the verification link in their email. When the
      user attempts to verify their email, we can compare the token they provide with the one stored
      in the database to ensure that it is valid and has not expired.
    */
    newUser.token = token;

    /*
      Finally, we save the new user to the database. This will persist the user's information, including
      their name, email, hashed password, and the verification token. After saving the user, we return
      a response to the client with a success message, the newly created user's information, and a status
      code of 201 Created. If any errors occur during this process, we catch the error and return a 500
      Internal Server Error response with the error message.
    */

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "user table created", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
  The verify function is responsible for handling the email verification process. It checks for 
  the presence of an authorization token in the request headers, verifies the token, and if valid,
  updates the user's record in the database to mark their email as verified. If the token is 
  missing, invalid, or expired, it returns appropriate error responses. If the verification is 
  successful, it returns a success message indicating that the email has been verified successfully.

*/
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    /*
      The token is extracted from the Authorization header, which is expected to be in
      the format "Bearer <token>". The token is then verified using the jsonwebtoken library.
      If the token is valid, the decoded payload (which contains the user's ID) is used to 
      find the corresponding user in the database. If the user is found, their token is set 
      to null and their isVerified field is set to true, indicating that their email has 
      been successfully verified.
    */
    const token = authHeader.split(" ")[1]; // [Bearer, kadhkahkda]

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res
        .status(400)
        .json({ success: false, message: "Token verification failed" });
    }

    /*
      If the token is valid and the user is found, we update the user's record in the database
      to set the token to null (indicating that it has been used) and to set isVerified to true
      (indicating that the user's email has been verified). Finally, we return a success response
      indicating that the email has been verified successfully. If any errors occur during this
      process, we catch the error and return a 500 Internal Server Error response with the error message. 
    */

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    user.token = null;
    user.isVerified = true;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "email verified successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  The reVerify function is responsible for handling the re-verification process for users who may have missed
  the initial verification email or whose verification token has expired. It takes the user's email from the
  request body, checks if a user with that email exists in the database, and if so, generates a new verification
  token. The new token is sent to the user's email for verification, and the user's record in the database is 
  updated with the new token. If the user is not found, it returns a 400 Bad Request response. If the re-verification 
  email is sent successfully, it returns a success message along with the new token. If any errors occur during this 
  process, it catches the error and returns a 500 Internal Server Error response with the error message.
*/

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    verifyEmail(token, email); // sending email for verification
    user.token = token;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "verification email sent again successfully",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
  The login function is responsible for handling the user login process. It takes the user's email and password from the
  request body, checks if the user exists in the database, and if so, compares the provided password with the stored hashed
  password. If the password is valid and the user's email is verified, it generates an access token and a refresh token for 
  the user. The access token is used for accessing protected routes, while the refresh token can be used to generate a new
  access token when the current one expires. The function also manages user sessions by checking for existing sessions and 
  creating a new session upon successful login. Finally, it returns a response with a success message, the user's information,
  and the generated tokens. If any errors occur during this process, it catches the error and returns a 500 Internal Server 
  Error response with the error message.
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "username or password is missing" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user is not registered" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "invalid password" });
    }

    if (user.isVerified === false) {
      return res
        .status(400)
        .json({ success: false, message: "verify account" });
    }

    /*
      Generating access token and refresh token for the user using jsonwebtoken library.
      Access token is valid for 10 days and refresh token is valid for 30 days.  
      Access token is used to access protected routes and refresh token is 
      used to generate new access token when the current access token expires.
    */

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    user.isLoggedIn = true;
    await user.save();

    /*
      Before creating a new session for the user, we check if there is an
      existing session for the user in the database. If there is an existing
      session, we delete it to ensure that there is only one active session for 
      the user at a time.
    */

    const currentSession = await Session.findOne({ userId: user._id });

    if (currentSession) {
      await Session.deleteOne({ userId: user._id });
    }

    /*
      After deleting the existing session (if any), we create a new session for the user
      and save it in the database. This session will be used to track the user's login 
      status and manage their access to protected routes.    
    */

    await Session.create({ userId: user._id });

    /*
      Finally, we return a response to the client with a success message, the user's 
      information, and the generated access token and refresh token. The client can 
      use the access token
    */

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.firstName} ${user.lastName}`,
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `login unsuccessful : ${error.message}`,
    });
  }
};

/*
  The logout function is responsible for handling the user logout process.  This function would 
  typically involve invalidating the user's session, clearing any authentication tokens, and updating 
  the user's login status in the database. The function would also return an appropriate response to 
  the client indicating that the logout was successful or if any errors occurred during the process.
*/
export const logout = async (req, res) => {
  try {
    // Extract the user ID from the authenticated request (set by isAuthenticated middleware)
    const userId = req.id;

    // Delete all active sessions for the user to invalidate any existing tokens
    await Session.deleteMany({ userId: userId });

    // Update the user's login status to false in the database
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    // Return a success response indicating the logout was completed
    return res
      .status(200)
      .json({ success: true, message: "logged out successfully" });
  } catch (error) {
    // Handle any errors that occur during the logout process
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
  forgotPassword handles password reset requests by email.
  It verifies the email exists, generates a one-time OTP, stores it with an expiry,
  and sends the OTP to the user's email address.
  The response indicates whether the OTP was sent successfully or if an error occurred.
*/
export const forgotPassword = async (req, res) => {
  try {
    // extract email from request body
    const { email } = req.body;

    // return early if the client did not provide an email
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // find the user by email before issuing an OTP
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user is not registered" });
    }

    // generate a 6-digit OTP and set a 10-minute expiry window
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // store OTP and expiry in the user document for later validation
    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    // send the OTP email to the user
    await sendOtpMail(otp, email);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
OTP verification function to validate the OTP provided by the user during password reset.
This function will check if the provided OTP matches the one stored in the database for 
the user and if it is still valid (not expired). If the OTP is valid, it will allow the user
to proceed with resetting their password. If the OTP is invalid or expired, it will return an
appropriate error response.

steps to implement:
1. Extract email and OTP from the request body.
2. Validate that both email and OTP are provided.
3. Find the user by email in the database.
4. Check if the provided OTP matches the one stored in the user's record and 
if it is still valid.
5. If valid, allow the user to reset their password (this may involve generating a 
password reset token or directly allowing password change).
6. If invalid or expired, return an error response indicating the issue with the OTP.

*/

/**
 * verifyOtp validates a one-time password for password reset requests.
 * It checks that the OTP exists, is not expired, and matches the stored value,
 * then clears it from the user record on success.
 */
export const verifyOTP = async (req, res) => {
  try {
    // extract OTP from request body and email from URL parameters
    const { otp } = req.body;
    const email = req.params.email;

    // validate that OTP was provided by the client
    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });
    }

    // look up the user by email address
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doesnot exists" });
    }

    // ensure an OTP was previously generated and stored for this user
    if (!user.otp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, message: "otp doesnot exists" });
    }

    // check if the OTP has expired by comparing the stored expiry time to current time
    if (user.otpExpiry < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "otp has expired" });
    }

    // verify the provided OTP matches the one stored in the database
    if (otp != user.otp) {
      return res
        .status(400)
        .json({ success: false, message: "otp doesnot match" });
    }

    // clear the OTP and expiry from the user record after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "otp verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "otp verification failed" });
  }
};

/*
 * changePassword updates a user's password after verifying their identity.
 * It should be called after successful OTP verification or other authentication steps.
 * steps to implement:
 * 1. Extract email and new password from the request body.
 * 2. Validate that both email and new password are provided.
 * 3. Find the user by email in the database.
 * 4. Update the user's password with the new value (after hashing it).
 * 5. Save the updated user record to the database.
 * 6. Return a success response indicating the password was changed successfully.
 * 7. Handle any errors that occur during this process and return appropriate error responses.
 */
export const changePassword = async (req, res) => {
  try {
    // Extract the new password and confirm password from the request body,
    // and the email from the URL parameters (e.g., /change-password/:email)
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;

    // Find the user in the database using the provided email
    const user = await User.findOne({ email });

    // Check if the user exists; if not, return an error response
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user is not registered" });
    }

    // Validate that both newPassword and confirmPassword are provided
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "new password or confirm password is missing",
      });
    }

    // Ensure the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "new password and confirm password do not match",
      });
    }

    // Update the user's password (the model's pre-save hook will hash it automatically)
    user.password = newPassword;

    // Save the updated user record to the database
    await user.save();

    // Return a success response indicating the password was changed
    return res
      .status(200)
      .json({ success: true, message: "password changed successfully" });
  } catch (error) {
    // Handle any unexpected errors and return a server error response
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
  getAllUser retrieves all users from the database and returns them in the response.
  This controller is typically used for administrative or debugging purposes when
  the client needs a complete list of user records.

  Behavior:
  - Queries the User collection for all documents.
  - Returns a 200 OK response with the users when successful.
  - Returns a 500 Internal Server Error if an exception occurs.
*/
export const getAllUser = async (req, res) => {
  try {
    // Fetch all users from the database. This will return an array of user objects.
    const user = await User.find();

    return res.status(200).json({
      success: true,
      message: "all users",
      user: user,
    });
  } catch (error) {
    // If any error occurs while querying the database, return a generic server error.
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* 
  step 1: Extract the user ID from the request parameters (e.g., /user/:id).
  step 2: Validate that the user ID is provided and is in the correct format.
  step 3: Query the database to find the user by their ID.
  step 4: If the user is found, return a success response with the user's information.
  step 5: If the user is not found, return a 404 Not Found response.
  step 6: Handle any errors that occur during this process and return a 500 Internal 
  Server Error response if necessary.
*/

export const getUserById = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { userId } = req.params;

    // Query the database to find the user by ID, excluding sensitive fields like password, OTP, and token
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );

    // If the user is not found, return a 400 Bad Request response
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user doenot exists" });
    }

    // Return a success response with the user data
    return res
      .status(200)
      .json({ success: true, message: "user found", user: user });
  } catch (error) {
    // Handle any errors and return a 500 Internal Server Error response
    return res.status(500).json({ success: false, message: error.message });
  }
};
