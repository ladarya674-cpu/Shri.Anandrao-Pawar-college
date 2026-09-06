const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Uploads an image buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer
 * @param {string} publicId - The destination public_id
 */
const uploadImage = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary image upload error:", error.message)
          return reject(new Error("Failed to upload image to Cloudinary"))
        }
        resolve(result)
      },
    )
    uploadStream.end(buffer)
  })
}

/**
 * Uploads a PDF buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer
 * @param {string} publicId - The destination public_id
 */
const uploadPdf = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary PDF upload error:", error.message)
          return reject(new Error("Failed to upload PDF to Cloudinary"))
        }
        resolve(result)
      },
    )
    uploadStream.end(buffer)
  })
}

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public_id of the image to delete
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    })
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Unexpected result from Cloudinary: ${result.result}`)
    }
    return true
  } catch (err) {
    console.error("Cloudinary image deletion error:", err.message)
    throw new Error("Failed to delete image from Cloudinary")
  }
}

/**
 * Deletes a PDF (raw resource) from Cloudinary
 * @param {string} publicId - The public_id of the PDF to delete
 */
const deletePdf = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true,
    })
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Unexpected result from Cloudinary: ${result.result}`)
    }
    return true
  } catch (err) {
    console.error("Cloudinary PDF deletion error:", err.message)
    throw new Error("Failed to delete PDF from Cloudinary")
  }
}

/**
 * Generate a Cloudinary URL for an asset
 * @param {string} publicId
 * @param {string} resourceType - "image" or "raw"
 */
const getCloudinaryUrl = (publicId, resourceType) => {
  return cloudinary.url(publicId, { resource_type: resourceType, secure: true })
}

module.exports = {
  uploadImage,
  uploadPdf,
  deleteImage,
  deletePdf,
  getCloudinaryUrl,
}
