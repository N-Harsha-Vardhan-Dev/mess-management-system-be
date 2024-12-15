const { pool } = require('../models/db');
const fs = require('fs'); // For file system operations (optional)



const provideFeedback = (req, res, next) => {
    const { userId, messNo, TimelinessOfService, CleanlinessOfDiningHall, FoodQuality, 
        QuantityOfFood, CourtesyOfStaff, StaffHygiene, MenuAdherence, WashAreaCleanliness, 
        Comments, FeedbackDuration } = req.body;

    const sql = `
        INSERT INTO Feedback (
            userId, messNo, TimelinessOfService, CleanlinessOfDiningHall, FoodQuality, 
            QuantityOfFood, CourtesyOfStaff, StaffHygiene, MenuAdherence, WashAreaCleanliness, 
            Comments, FeedbackDuration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(sql, [
        userId, messNo, TimelinessOfService, CleanlinessOfDiningHall, FoodQuality, 
        QuantityOfFood, CourtesyOfStaff, StaffHygiene, MenuAdherence, WashAreaCleanliness, 
        Comments, FeedbackDuration
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Feedback added successfully', feedbackId: result.insertId });
    });
};

// Add an Issue with an Image
const addIssues = (req, res, next) => {
  const { description, category, status , userId} = req.body;
  const image = req.file; // Multer stores the file in `req.file`
  console.log(description);
  // Validate input fields
  if (!description || !category) {
    return res.status(400).json({ success: false, message: 'Description and category are required' });
  }

  // Read the image file as binary data (if provided)
  let imageData = null;
  if (image) {
    imageData = fs.readFileSync(image.path);
  }

  const query = `
    INSERT INTO Issues (description, category, image, status, userId, created_at, updated_at)
    VALUES (?, ?, ?, ?,?, NOW(), NOW())
  `;

  pool.query(query, [description, category, imageData, status || 'pending', userId], (err, results) => {
    if (err) {
      return next(err);
    }
    res.json({
      success: true,
      message: 'Issue added successfully',
      issueId: results.insertId,
    });
  });
};

const getBatches = (req, res, next) => {
  // Query to get distinct batches
  const query = 'SELECT DISTINCT batch FROM Student';

  pool.query(query, (err, results) => {
    if (err) return next(err);

    // If no batches found
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No batches found',
      });
    }

    // Return distinct batches
    const batches = results.map((row) => row.batch);
    res.json({
      success: true,
      message: 'Distinct batches fetched successfully',
      batches: batches, // An array of distinct batches
    });
  });
};

const getStudentByMess = (req, res, next) => {
  const { messNo } = req.params;  // Extract messNo from URL parameter

  // Validate if messNo is provided
  if (!messNo) {
    return res.status(400).json({
      success: false,
      message: 'messNo is required',
    });
  }

  // Query to get students from the specified messNo
  const query = 'SELECT email, name FROM Student WHERE messNo = ?';

  pool.query(query, [messNo], (err, results) => {
    if (err) return next(err);

    // If no students found for the given messNo
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No students found for messNo ${messNo}`,
      });
    }

    // Return student data for the specified messNo
    res.json({
      success: true,
      message: `Students for messNo ${messNo} fetched successfully`,
      students: results, // Array of student objects
    });
  });
};


module.exports = { provideFeedback, addIssues , getBatches, getStudentByMess};

// Implement similar logic for other student actions: reportIssue, trackStatus, viewHistory, searchIssues

// module.exports = { provideFeedback };
