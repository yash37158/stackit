import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'stackit',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Error uploading image to Cloudinary');
  }
};

export const deleteImage = async (publicUrl: string): Promise<void> => {
  try {
    const publicId = publicUrl.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`stackit/${publicId}`);
  } catch (error) {
    throw new Error('Error deleting image from Cloudinary');
  }
}; 