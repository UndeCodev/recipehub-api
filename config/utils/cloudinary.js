import {v2 as cloudinary} from 'cloudinary';
import {CLOUD_NAME, API_KEY, API_SECRET} from '../index.js';

// Configuration 
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

export const uploadImageProfile = async(filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'recipehub/profile_pictures'
    });
}

export const deleteImage = async(publicId) => {
    return await cloudinary.uploader.destroy(publicId);
}