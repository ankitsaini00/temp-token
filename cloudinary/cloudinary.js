const cloudinary = require("cloudinary").v2,
    {CloudinaryStorage}= require("multer-storage-cloudinary"),
    multer = require("multer"),
    crypto = require("crypto");


function cloudinaryUpload(folder) {
    cloudinary.config({
        cloud_name: "marvansmobile-com",
        api_key: "751164237665492",
        api_secret: process.env.api_secret
    });

    const storage =new CloudinaryStorage({
        cloudinary,
        params:{
            folder: folder,
            allowedFormats: ["jpeg", "jpg", "png"],
            
        },
        filename: (req, file, cb) => {
            let buf = crypto.randomBytes(16);
            buf = buf.toString("hex");
            let uniqueFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
            uniqueFileName += buf;
            cb(undefined, uniqueFileName);
        }
       
    });

    const upload = multer({ storage });
    // console.log(upload)
    return {
        upload:upload
    }
}


module.exports = {
    cloudinaryUpload,
    cloudinary
};
