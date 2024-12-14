const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Path for the uploads directory
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// const {
//   provideFeedback,
//   reportIssue,
//   trackStatus,
//   viewHistory,
//   searchIssues,
// } = require('../controllers/studentController');
const {provideFeedback,  addIssues } = require('../controllers/studentController');

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Directory where uploaded files will be saved temporarily
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Custom filename with timestamp
  },
});
const upload = multer({ storage }); // Apply the multer configuration
router.post('/feedback', provideFeedback);
// router.post('/report', reportIssue);
// router.get('/status/:id', trackStatus);
// router.get('/history', viewHistory);
// router.get('/search', searchIssues);
router.post('/issues', upload.single('image'), addIssues);

module.exports = router;
