import multer from 'multer';

const storage = multer.memoryStorage();

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedDocumentTypes = ['application/pdf'];

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
    }
  },
});

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (allowedDocumentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document type. Only PDF documents are allowed.'), false);
    }
  },
});
