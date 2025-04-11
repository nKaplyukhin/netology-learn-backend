const multer = require("multer");
const { booksFilePath } = require("../common");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, booksFilePath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

module.exports = multer({ storage });
