
import { v2 as cloudinary } from "cloudinary";


export const uploadImagetoCloudinary = async (file) => {
  try {
    if (!file) return null;

    const base64 = file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${base64}`,
      {
        resource_type: "image",
      }
    );

    return result;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null; // prevent crash
  }
};



