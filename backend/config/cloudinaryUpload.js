import cloudinary from "./cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary via a stream.
 * @param {Buffer} fileBuffer - The buffer from req.file.buffer
 * @param {String} folderName - Optional folder name in Cloudinary (e.g., 'trader_avatars')
 * @returns {Promise<Object>} - Cloudinary upload result object
 */
export const uploadToCloudinary = (fileBuffer, folderName = "trading_app") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "auto", // Automatically detect image vs raw file
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Write the buffer to the stream and end it
    uploadStream.end(fileBuffer);
  });
};