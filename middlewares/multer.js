const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".csv" || ext === ".json") {
    cb(null, true);
  } else {
    cb(new Error("Only .csv and .json files are allowed"));
  }
};

module.exports = multer({ storage, fileFilter });
