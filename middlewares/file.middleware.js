const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tmp',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});
 
const parser = multer({ storage: storage });

// Ahora tenemos un nuevo middleware de subida de archivos
const uploadToCloudinary = async (req, res, next) => {
	if (req.file) {
    try{
		const filePath = req.file.path;
    const image = await cloudinary.uploader.upload(filePath);

		// Borramos el archivo local
    await fs.unlinkSync(filePath);
	
		// Añadimos la propiedad file_url a nuestro Request
    req.file_url = image.secure_url;
		return next();
    }catch(error){
      return next(error)
    }
  } else {
    return next();
  }
};
module.exports = { parser, uploadToCloudinary };