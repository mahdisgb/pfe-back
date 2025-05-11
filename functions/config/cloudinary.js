const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    allowed_formats: [
      'mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v', '3gp', 'mpeg', 'mpg',
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 
      'video/webm', 'video/x-flv', 'video/x-ms-wmv', 'video/x-m4v', 
      'video/3gpp', 'video/mpeg'
    ],
    max_file_size: 500000000, // 500MB
    eager: [
      { 
        format: "mp4",
        quality: "auto",
        fetch_format: "auto"
      }
    ],
    eager_async: false, // Set to false to wait for processing
    return_delete_token: true
  }
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course_thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});

const videoUpload = multer({ storage: videoStorage });
const imageUpload = multer({ storage: imageStorage });

module.exports = { cloudinary, videoUpload, imageUpload }; 