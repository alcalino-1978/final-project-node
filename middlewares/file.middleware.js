const path = require('path');
const multer = require('multer');
const streamifier = require("streamifier");

const cloudinary = require('cloudinary').v2;

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     filename: (req, file, cb) => {
//         console.log('filename ->', file);
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../tmp'))
//     },
// });

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        const error = new Error("Invalid file type");
        cb(error)
    } else {
        cb(null, true);
    }
};

const upload = multer({
    // storage,
    storage: storage,
    fileFilter,
});

// Ahora tenemos un nuevo middleware de subida de archivos
const uploadToCloudinary = async (req, res, next) => {
  const data = req.file.buffer;
  const stream = cloudinary.uploader.upload_stream(
    { folder: "DEV" },
    (error, result) => {
      if (error) return next(error);
      req.file_url = result.secure_url;
      return next();
    }
  );
  streamifier.createReadStream(data).pipe(stream);
};

module.exports = { upload: upload, uploadToCloudinary };