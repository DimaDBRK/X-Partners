
// Save file
import multer from "multer";
import path from "path";
import fs from "fs"

// Update Item Picture 

const maxFileSize = 1 * 1024 * 1024; // 1 MB

// file filter => only images and a size limit
const imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/');
  },
  filename: function(req, file, cb) {
      const itemId = req.params.id;
      const fileExtension = path.extname(file.originalname);
      const filename = itemId + fileExtension;
      const fullPath = path.join('public/images/', filename);

      fs.access(fullPath, fs.constants.F_OK, (err) => {
          if (!err) {
              fs.unlink(fullPath, (unlinkErr) => {
                  if (unlinkErr) {
                      return cb(unlinkErr);
                  }
                  cb(null, filename);
              });
          } else {
              cb(null, filename);
          }
      });
  }
});

// Initialize multer upload with imageFilter, storage configuration, and size limit
export const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: maxFileSize }
}).single('itemImage');
