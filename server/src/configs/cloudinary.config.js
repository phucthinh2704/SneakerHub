// config/cloudinary.config.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cấu hình Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

// Cấu hình Storage cho Multer
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "sneakerhub", // Tên folder trên Cloudinary
		allowed_formats: ["jpg", "png", "jpeg"], // Định dạng cho phép
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
