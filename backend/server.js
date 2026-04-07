import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import routes from "./routes/user.routes.js";
import cors from "cors";

// Create an instance of the Express application
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies in requests
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Use the user routes for any requests to /api/v1/user. This means that any request
// to such as /api/v1/user/register or /api/v1/user/verify, etc. will be handled by
// the corresponding functions in user.controllers.js.
app.use("/api/v1/user", routes);

// Start the server and listen on the specified port. When the server starts, it will
// connect to the database and log a message indicating that the server is running.
// The PORT is typically defined in the .env file, and connectDB is a function that
// establishes a connection to the database.

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is listening on port " + process.env.PORT);
});
