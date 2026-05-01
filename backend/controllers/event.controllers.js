import getDataUri from "../Utils/dataUri.js";
import cloudinary from "../Utils/cloudinary.js";
import { Event } from "../models/event.models.js";
import { Gallery } from "../models/gallery.models.js";
import { safeDestroy } from "../Utils/cloudinaryUtils.js";

import "dotenv/config.js";

// helper: upload one file
const uploadToCloudinary = async (fileBuffer) => {
  const result = await cloudinary.uploader.upload(fileBuffer, {
    folder: "events",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

// CREATE EVENT (with optional cover image)
export const createEvent = async (req, res) => {
  try {
    const { title, description } = req.body;

    let coverImage = {
      url: "",
      public_id: "",
    };

    // ---------------------------
    // HANDLE SINGLE IMAGE
    // ---------------------------
    if (req.file) {
      const fileUri = getDataUri(req.file);

      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "events/cover",
      });

      coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // ---------------------------
    // CREATE EVENT
    // ---------------------------
    const event = await Event.create({
      title,
      description,
      createdBy: req.user._id,
      coverImage,
    });

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Event creation failed",
    });
  }
};

// Upload Images Under Event

export const uploadEventImages = async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log(eventId);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image required",
      });
    }

    const uploadedImages = [];

    for (let file of req.files) {
      const fileUri = getDataUri(file);

      const result = await cloudinary.uploader.upload(fileUri, {
        folder: `events/${eventId}`,
      });

      const image = await Gallery.create({
        eventId,
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });

      uploadedImages.push(image);
    }

    // ⭐ AUTO SET COVER IMAGE (first upload OR replace existing)
    const event = await Event.findById(eventId);

    if (!event.coverImage) {
      event.coverImage = uploadedImages[0].imageUrl;
      await event.save();
    }

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: uploadedImages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

// get event details by id

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get event
    const event = await Event.findById(id).populate(
      "createdBy",
      "firstName lastName email",
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 2. Get gallery images
    const images = await Gallery.find({ eventId: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: {
        event,
        images,
      },
    });
  } catch (error) {
    console.log("getEventById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
    });
  }
};

// get images
export const getEventImages = async (req, res) => {
  const { eventId } = req.params;

  const images = await Gallery.find({
    eventId,
    isActive: true,
  });

  res.json({
    success: true,
    data: images,
  });
};

// update Event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, deleteImageIds, setCoverImageId } = req.body;

    // 1. update event basic fields
    const event = await Event.findByIdAndUpdate(
      eventId,
      { title, description },
      { new: true },
    );

    // 2. DELETE SELECTED IMAGES (VERY IMPORTANT)
    if (deleteImageIds && deleteImageIds.length > 0) {
      const imagesToDelete = await Gallery.find({
        _id: { $in: deleteImageIds },
        eventId,
      });

      // delete from cloudinary first
      await Promise.all(
        imagesToDelete.map(async (img) => {
          try {
            if (img.public_id) {
              await cloudinary.uploader.destroy(img.public_id);
            }
          } catch (err) {
            console.log("Cloudinary delete failed:", img.public_id);
          }
        }),
      );

      // then delete from DB
      await Gallery.deleteMany({
        _id: { $in: deleteImageIds },
        eventId,
      });
    }

    // 3. ADD NEW IMAGES
    let newImages = [];

    if (req.files?.length > 0) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const fileUri = getDataUri(file);

          const result = await cloudinary.uploader.upload(fileUri, {
            folder: `events/${eventId}`,
          });

          return Gallery.create({
            eventId,
            imageUrl: result.secure_url,
            public_id: result.public_id,
          });
        }),
      );

      // if no cover image exists → set first uploaded
      if (!event.coverImage && newImages.length > 0) {
        event.coverImage = newImages[0].imageUrl;
        await event.save();
      }
    }

    // 4. OPTIONAL: set cover image manually
    if (setCoverImageId) {
      const coverImg = await Gallery.findById(setCoverImageId);

      if (coverImg) {
        event.coverImage = coverImg.imageUrl;
        await event.save();
      }
    }

    return res.json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// delete event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. check if event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 2. find all images linked to this event
    const images = await Gallery.find({ eventId });

    // 3. destroy images from Cloudinary (safe + parallel)
    await Promise.all(
      images.map(async (img) => {
        try {
          if (img.public_id) {
            await safeDestroy(img.public_id);
          }
        } catch (err) {
          console.log("Cloudinary delete failed:", img.public_id);
        }
      }),
    );

    // 4. delete images from MongoDB
    await Gallery.deleteMany({ eventId });

    // 5. delete event itself
    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      success: true,
      message: "Event and all associated images deleted successfully",
    });
  } catch (error) {
    console.log("Delete Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting event",
    });
  }
};
