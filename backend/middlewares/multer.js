import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/\s+/g, "_");
    callback(null, file.fieldname + "-" + uniqueSuffix + "-" + sanitizedName);
  },
});

const upload = multer({ storage });
export default upload;
