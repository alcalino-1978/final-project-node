const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');

cloudinary.config({
  cloud_name: 'dzs1ujqtn',
  api_key: '134183255414445',
  api_secret: process.env.CLOUDINARY_SECRET
});

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        const error = new Error("Invalid file type");
        cb(error)
    } else {
        cb(null, true);
    }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
  let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
  console.log(uniqFileName)
    return {
      folder: 'images',
      format: 'jpeg',
      public_id: uniqFileName,
    };
  },
});
 
const upload = multer({
  // storage,
  storage: storage,
  fileFilter,
});

module.exports = { upload };