import getDataUri from "../Utils/dataUri.js";
import cloudinary from "../Utils/cloudinary.js";
import { Event } from "../models/event.models.js";
import { Gallery } from "../models/gallery.models.js";
import { safeDestroy } from "../Utils/cloudinaryUtils.js";
import { TEMP_CHUNKS_DIR } from "../config/storagePaths.js";
import { UPLOAD_CONFIG } from "../config/uploadConfig.js";
import path from "path";
import fs from "fs-extra";

// ===================== GET ALL EVENTS =====================
export const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      city,
      state,
      country,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (city) query.city = city;
    if (state) query.state = state;
    if (country) query.country = country;

    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select("-videos"),

      Event.countDocuments(query),
    ]);

    res.json({
      success: true,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalEvents: total,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// ===================== GET EVENT BY ID =====================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "firstName lastName email",
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const images = await Gallery.find({ eventId: event._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: { event, images } });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ===================== HELPERS =====================
const findEvent = async (id) => await Event.findById(id);

const uploadImage = async (file, eventId) => {
  const result = await cloudinary.uploader.upload(getDataUri(file), {
    folder: `events/images/${eventId}`,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

const fixCover = async (event) => {
  const images = await Gallery.find({ eventId: event._id });

  if (!images.length) {
    event.coverImage.url = "";
    event.coverImage.public_id = "";
  } else if (!images.some((i) => i.imageUrl === event.coverImage.url)) {
    event.coverImage.url = images[0].imageUrl;
  }

  await event.save();
};

// ===================== CREATE =====================
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      coverImage: { url: "", public_id: "" },
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: event });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ===================== UPLOAD IMAGES =====================
export const uploadEventImages = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.files?.length) {
      return res.status(400).json({ message: "Images required" });
    }

    const event = await findEvent(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const images = await Promise.all(
      req.files.map(async (file) => {
        const data = await uploadImage(file, eventId);

        return Gallery.create({
          eventId,
          imageUrl: data.url,
          public_id: data.public_id,
        });
      }),
    );

    if (!event.coverImage.url) {
      event.coverImage.url = images[0].imageUrl;
      event.coverImage.public_id = images[0].public_id;
      await event.save();
    }

    res.status(201).json({ success: true, data: images });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ===================== UPDATE EVENT =====================
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { deleteImageIds, setCoverImageId, ...updates } = req.body;

    const event = await findEvent(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    Object.assign(event, updates);

    if (deleteImageIds?.length) {
      const imgs = await Gallery.find({ _id: { $in: deleteImageIds } });

      await Promise.all(
        imgs.map((img) => img.public_id && safeDestroy(img.public_id)),
      );

      await Gallery.deleteMany({ _id: { $in: deleteImageIds } });
    }

    if (req.files?.length) {
      for (const file of req.files) {
        const data = await uploadImage(file, eventId);

        await Gallery.create({
          eventId,
          imageUrl: data.url,
          public_id: data.public_id,
        });

        if (!event.coverImage) event.coverImage = data.url;
      }
    }

    if (setCoverImageId) {
      const img = await Gallery.findById(setCoverImageId);
      if (img) event.coverImage = img.imageUrl;
    }

    await fixCover(event);

    res.json({ success: true, data: event });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ============= SAFE VIDEO DESTROY
export const safeDestroyVideo = async (public_id) => {
  try {
    if (!public_id) return;

    await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
    });
  } catch (err) {
    console.error("❌ Failed to delete video:", public_id, err.message);
  }
};
// ===================== DELETE EVENT =====================
export const deleteEvent = async (req, res) => {
  try {
    const event = await findEvent(req.params.eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const images = await Gallery.find({ eventId: event._id });

    if (images) {
      await Promise.all(
        images.map((img) => img.public_id && safeDestroy(img.public_id)),
      );
      await Gallery.deleteMany({ eventId: event._id });
    }

    if (event.videos?.length > 0) {
      await Promise.all(event.videos.map((v) => safeDestroyVideo(v.public_id)));
    }

    await event.deleteOne();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ===================== DELETE IMAGE =====================
export const deleteEventImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    const event = await findEvent(image.eventId);

    if (image.public_id) await safeDestroy(image.public_id);

    await image.deleteOne();
    await fixCover(event);

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ===================== SET COVER =====================
export const setCoverImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    const event = await findEvent(image.eventId);
    event.coverImage = image.imageUrl;
    await event.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

const uploadVideo = async (file, eventId) => {
  const result = await cloudinary.uploader.upload(getDataUri(file), {
    resource_type: "video",
    folder: `events/videos/${eventId}`,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
    duration: result.duration,
    format: result.format,
    size: result.bytes,
    thumbnail: cloudinary.url(result.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 400, height: 300, crop: "fill" },
        { quality: "auto" },
        { start_offset: "auto" }, // 🎯 Cloudinary picks best frame
      ],
    }),
  };
};

// ===================== VIDEOS =====================
export const uploadEventVideos = async (req, res) => {
  try {
    const { eventId } = req.params;

    // ✅ 1. FIND EVENT
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ 2. VALIDATE FILES
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No videos uploaded" });
    }

    // ✅ 3. ENSURE ARRAY EXISTS
    event.videos = event.videos || [];

    // ✅ 4. LIMIT CHECK
    const MAX_VIDEOS = 2;
    if (
      event.videos.length + req.files.length >
      UPLOAD_CONFIG.VIDEO.MAX_COUNT
    ) {
      return res.status(400).json({
        message: `Max ${UPLOAD_CONFIG.VIDEO.MAX_COUNT} videos allowed`,
      });
    }

    // ✅ 5. UPLOAD VIDEOS (CLOUDINARY)
    const uploadedVideos = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
          file.path || file, // supports both disk + memory
          {
            resource_type: "video",
            folder: `events/videos/${eventId}`,
          },
        );

        return {
          url: result.secure_url,
          public_id: result.public_id,
          duration: result.duration,
          format: result.format,
          size: result.bytes,
          thumbnail: cloudinary.url(result.public_id, {
            resource_type: "video",
            format: "jpg",
            transformation: [
              { width: 400, height: 300, crop: "fill" },
              { quality: "auto" },
              { start_offset: "auto" },
            ],
          }),
        };
      }),
    );

    // ✅ 6. PREVENT DUPLICATES (OPTIONAL SAFETY)
    const uniqueVideos = uploadedVideos.filter(
      (newVid) => !event.videos.some((existing) => existing.url === newVid.url),
    );

    // ✅ 7. SAVE
    event.videos.push(...uniqueVideos);
    await event.save();

    res.json({
      success: true,
      count: uniqueVideos.length,
      data: uniqueVideos,
    });
  } catch (err) {
    console.error("❌ Upload video error:", err);

    res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: err.message,
    });
  }
};

// delete event videos
export const deleteEventVideo = async (req, res) => {
  try {
    const event = await findEvent(req.params.eventId);

    const video = event?.videos?.id(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await cloudinary.uploader.destroy(video.public_id, {
      resource_type: "video",
    });

    video.remove();
    await event.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

export const updateEventVideo = async (req, res) => {
  try {
    const event = await findEvent(req.params.eventId);

    const video = event?.videos?.id(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    await cloudinary.uploader.destroy(video.public_id, {
      resource_type: "video",
    });

    const newVideo = await uploadVideo(req.file, event._id);

    Object.assign(video, newVideo);
    await event.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// video chunk controller

export const uploadVideoChunk = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { index, fileName, totalChunks } = req.body;

    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    // 1️⃣ INIT TRACKER
    initUpload(eventId, safeFileName, totalChunks);

    // 2️⃣ SAVE CHUNK
    const chunkDir = path.join("temp_chunks", eventId, safeFileName);

    await fs.ensureDir(chunkDir);

    const chunkPath = path.join(chunkDir, `chunk-${index}`);

    await fs.move(req.file.path, chunkPath, { overwrite: true });

    // 3️⃣ MARK RECEIVED
    markChunkReceived(eventId, safeFileName, index);

    // 4️⃣ AUTO CHECK COMPLETION
    if (isUploadComplete(eventId, safeFileName)) {
      console.log("All chunks received → merging...");

      // AUTO MERGE TRIGGER
      await mergeVideoChunksInternal(eventId, safeFileName);
    }

    return res.json({
      success: true,
      message: "Chunk uploaded",
      index,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Chunk upload failed",
    });
  }
};

export const mergeVideoChunksInternal = async (eventId, fileName) => {
  try {
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    const chunkDir = path.join(TEMP_CHUNKS_DIR, eventId, safeFileName);

    const outputDir = "uploads/videos";
    await fs.ensureDir(outputDir);

    const finalVideoPath = path.join(
      outputDir,
      `${Date.now()}-${safeFileName}`,
    );

    // ❗ CHECK IF CHUNKS EXIST
    const chunks = await fs.readdir(chunkDir);

    if (!chunks || chunks.length === 0) {
      throw new Error("No chunks found for merging");
    }

    // sort safely
    const sortedChunks = chunks.sort((a, b) => {
      const aIndex = parseInt(a.split("-")[1]);
      const bIndex = parseInt(b.split("-")[1]);
      return aIndex - bIndex;
    });

    const writeStream = fs.createWriteStream(finalVideoPath);

    // MERGE
    for (const chunk of sortedChunks) {
      const chunkPath = path.join(chunkDir, chunk);
      const data = await fs.readFile(chunkPath);
      writeStream.write(data);
    }

    writeStream.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("✅ Merge completed:", finalVideoPath);

    // 🚀 CLOUDINARY UPLOAD
    const result = await cloudinary.uploader.upload_large(finalVideoPath, {
      resource_type: "video",
      folder: `events/videos/${eventId}`,
      chunk_size: 6 * 1024 * 1024, // 6MB
      timeout: 240000, // 2 min safety
    });

    if (!result?.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    console.log("✅ Cloudinary URL:", result.secure_url);

    // 💾 SAVE TO DB
    await Event.findByIdAndUpdate(eventId, {
      $push: {
        videos: {
          url: result.secure_url,
          public_id: result.public_id,
          thumbnail: cloudinary.url(result.public_id, {
            resource_type: "video",
            format: "jpg",
          }),
        },
      },
    });

    // 🧹 CLEANUP
    await fs.remove(chunkDir);
    await fs.remove(finalVideoPath);

    return result.secure_url;
  } catch (err) {
    console.error("❌ Merge Error:", err);
    throw err;
  }
};
