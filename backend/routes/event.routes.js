import express from "express";
import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/Auth.middleware.js";
import { multipleUpload, singleUpload } from "../middleware/multer.js";

import {
  createEvent,
  updateEvent,
  uploadEventImages,
  deleteEvent,
  getAllEvents,
  getEventById,
} from "../controllers/event.controllers.js";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  singleUpload, //single image
  createEvent,
);

router.post(
  "/:eventId/upload-images",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleUpload, // multiple images
  uploadEventImages,
);

router.get("/get", getAllEvents);
router.get("/:id", isAuthenticated, getEventById);

// delete event by id
router.delete(
  "/:eventId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  deleteEvent,
);

// update event
router.put(
  "/update/:eventId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleUpload, // for adding new images during update
  updateEvent,
);

export default router;
