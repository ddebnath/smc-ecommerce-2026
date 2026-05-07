import express from "express";

import {
  authorizeRoles,
  isAuthenticated,
} from "../middleware/Auth.middleware.js";

import {
  multipleImageUpload,
  multipleVideoUpload,
  uploadChunk,
} from "../middleware/multer.js";

import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  uploadEventImages,
  deleteEventImage,
  setCoverImage,
  uploadEventVideos,
  deleteEventVideo,
  updateEventVideo,
  uploadVideoChunk,
} from "../controllers/event.controllers.js";

const router = express.Router();

// ======= FETCH ALL EVENTS =================

router.get("/get", getAllEvents);
router.get("/details/:id", getEventById);

// ===== EVENTS =====
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleImageUpload,
  multipleVideoUpload,
  createEvent,
);

router.get("/get", getAllEvents);
router.get("/details/:id", getEventById);

router.put(
  "/update/:eventId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleImageUpload,
  updateEvent,
);

router.delete(
  "/delete/:eventId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  deleteEvent,
);

// ===== IMAGES =====
router.post(
  "/:eventId/images",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleImageUpload,
  uploadEventImages,
);

router.delete(
  "/images/:imageId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  deleteEventImage,
);

router.post(
  "/:eventId/videos",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleVideoUpload,
  uploadEventVideos,
);

router.patch(
  "/images/:imageId/cover",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  setCoverImage,
);

// ===== VIDEOS =====
router.post(
  "/:eventId/videos",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  multipleVideoUpload,
  uploadEventVideos,
);

router.delete(
  "/:eventId/videos/:videoId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  deleteEventVideo,
);

router.put(
  "/:eventId/videos/:videoId",
  isAuthenticated,
  authorizeRoles("admin", "productOwner"),
  updateEventVideo,
);

// =============================
// CHUNK ROUTE (FIXED)
// =============================
router.post("/:eventId/upload-video-chunk", uploadChunk, uploadVideoChunk);
// router.post("/:eventId/merge-video", mergeVideoChunks);

export default router;
