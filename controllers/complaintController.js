const { pool } = require('../models/db');

const viewComplaints = (req, res, next) => {
  pool.query('SELECT * FROM complaints', (err, results) => {
    if (err) return next(err);
    res.json({ success: true, data: results });
  });
};
const getFeedback = (req, res, next) =>{
  const sql = 'SELECT * FROM Feedback';
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
const getInspection = (req, res, next) =>{
  const sql = 'SELECT * FROM Inspection';
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


const provideInspection = (req, res, next) => {
  const {
      messNo, mrId, QualityAndExpiry, StandardsOfMaterials, StaffAndFoodAdequacy, 
      MenuDiscrepancies, SupervisorUpdates, FoodTasteAndQuality, KitchenHygiene, 
      UtensilCleanliness, ServiceTimingsAdherence, Comments
  } = req.body;

  const sql = `
      INSERT INTO Inspection (
          messNo, mrId, QualityAndExpiry, StandardsOfMaterials, StaffAndFoodAdequacy, 
          MenuDiscrepancies, SupervisorUpdates, FoodTasteAndQuality, KitchenHygiene, 
          UtensilCleanliness, ServiceTimingsAdherence, Comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(sql, [
      messNo, mrId, QualityAndExpiry, StandardsOfMaterials, StaffAndFoodAdequacy, 
      MenuDiscrepancies, SupervisorUpdates, FoodTasteAndQuality, KitchenHygiene, 
      UtensilCleanliness, ServiceTimingsAdherence, Comments
  ], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Inspection added successfully', inspectionId: result.insertId });
});
}

const getIssues = (req, res, next) => {
  const query = 'SELECT * FROM Issues';

  pool.query(query, (err, results) => {
    if (err) {
      return next(err);
    }

    // If no issues found
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No issues found' });
    }

    res.json({ success: true, issues: results });
  });
};

const updateIssueCount = (req, res, next) => {
  const { issueId } = req.params;
  const { incrementBy } = req.body; // Assuming increment value is provided in the request body

  // Validate increment value
  if (typeof incrementBy !== 'number' || incrementBy <= 0) {
    return res.status(400).json({ success: false, message: 'Increment value must be a positive number' });
  }

  // SQL query to increment the count field by the increment value
  const query = `
    UPDATE Issues
    SET count = IFNULL(count, 1) + ?, updated_at = NOW()
    WHERE issueId = ?
  `;

  pool.query(query, [incrementBy, issueId], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, message: 'Issue count updated successfully' });
  });
};

const updateIssueStatus = (req, res, next) => {
  const { issueId } = req.params;
  const { status } = req.body;

  // Validate status value
  const validStatuses = ['pending', 'in_progress', 'resolved'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  // SQL query to update the status
  const query = `
    UPDATE Issues
    SET status = ?, updated_at = NOW()
    WHERE issueId = ?
  `;

  pool.query(query, [status, issueId], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, message: 'Issue status updated successfully' });
  });
};

const getIssuesByUserId = (req, res, next) => {
  const { userId } = req.params;

  // SQL query to get issues for the given userId
  const query = 'SELECT * FROM Issues WHERE userId = ?';

  pool.query(query, [userId], (err, results) => {
    if (err) {
      return next(err);
    }

    // If no issues found for the user
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No issues found for this user' });
    }

    res.json({ success: true, issues: results });
  });
};

const getInspectionByDate = (req, res, next) => {
  const { inspectionDate } = req.params;

  // SQL query to get inspections for the given date
  const query = 'SELECT * FROM Inspection WHERE DATE(InspectionDate) = ?';

  pool.query(query, [inspectionDate], (err, results) => {
    if (err) {
      return next(err);
    }

    // If no inspections found for the given date
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No inspections found for this date' });
    }

    res.json({ success: true, inspections: results });
  });
};

const getInspectionDates = (req, res, next) => {
  // SQL query to get all InspectionDates
  const query = 'SELECT InspectionDate FROM Inspection';

  pool.query(query, (err, results) => {
    if (err) {
      return next(err);
    }

    // If no inspection dates are found
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No inspection dates found' });
    }

    // Convert timestamps to date strings and filter distinct dates
    const distinctDates = [
      ...new Set(
        results.map((row) => new Date(row.InspectionDate).toISOString().split('T')[0])
      ),
    ];

    // Send the list of distinct inspection dates
    res.json({ success: true, inspectionDates: distinctDates });
  });
};





// Implement resolveComplaint and escalateComplaint similarly

module.exports = {getFeedback, viewComplaints, 
  provideInspection , getInspection, getInspectionByDate, getInspectionDates, 
  getIssues, updateIssueCount, updateIssueStatus, getIssuesByUserId};
