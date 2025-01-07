// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadFileCloudinary = async (localPath) => {
//   try {
//     if (!localPath) return null;
//     // Upload the file to Cloudinary
//     const response = await cloudinary.uploader.upload(localPath, {
//       resource_type: "auto", // Automatically detects file type
//     });
//     console.log("File uploaded successfully: ", response.url);
//     return response;
//   } catch (error) {
//     console.error("Cloudinary upload error: ", error);
//     return null;
//   }
// };

// export { uploadFileCloudinary };
