const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, folder = 'greenshop') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const uploadMultipleToCloudinary = async (files, folder = 'greenshop') => {
  try {
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } catch (error) {
    throw new Error(`Error uploading images: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary
};