import cloudinary from "./cloudinary.js";

export const safeDestroy = async (publicId) => {
  if (!publicId) return false;

  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.log("Cloudinary delete failed:", publicId);
    return false;
  }
};
