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
  params: {
    folder: '/images',
    format: async (req, file) => {
      const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

      if (!VALID_FILE_TYPES.includes(file.mimetype)) {
        //formato no valido de imagen (ver error)
      } else {
        //devolver formato con el string cortado.
        var type = file.mimetype.substring(file.mimetype.indexOf('/')+1);
        return type;
      }
    },  
    public_id: (req, file) => {
      const imageName = file.originalname.substring(0 ,file.originalname.indexOf('.'));

      if(imageName != null){
        return imageName
      }else{
        return 'nombre por defecto'
      }
    }
  },
});
 
const upload = multer({
  // storage,
  storage: storage,
  fileFilter,
});

module.exports = { upload };