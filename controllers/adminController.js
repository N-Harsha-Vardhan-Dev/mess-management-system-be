const { pool } = require('../models/db');

// Register Mess Representative
const registerMR = (req, res, next) => {
  const { name, email } = req.body;
  pool.query(
    'INSERT INTO mess_representatives (name, email) VALUES (?, ?)',
    [name, email],
    (err, results) => {
      if (err) return next(err);
      res.json({ success: true, message: 'Mess representative registered' });
    }
  );
};

// Create Roles for Mess Representatives
const createRoles = (req, res, next) => {
  const { roleName, description } = req.body;
  pool.query(
    'INSERT INTO roles (role_name, description) VALUES (?, ?)',
    [roleName, description],
    (err, results) => {
      if (err) return next(err);
      res.json({ success: true, message: 'Role created successfully' });
    }
  );
};

// Approve Mess Representative
const approveMR = (req, res, next) => {
  const { mrId, approvedBy } = req.body;
  pool.query(
    'UPDATE mess_representatives SET status = "approved", approved_by = ? WHERE id = ?',
    [approvedBy, mrId],
    (err, results) => {
      if (err) return next(err);
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Mess representative not found' });
      }
      res.json({ success: true, message: 'Mess representative approved' });
    }
  );
};

const addCoordinator = (req, res, next) => {
  const { email, password, name, role } = req.body;

  // Step 1: Register member as a user
  pool.query(
    'INSERT INTO User (email, password, role) VALUES (?, ?, ?)', // Insert into User table
    [email, password, role], // Assuming role is 'faculty' for faculty members
    (err, results) => {
      if (err) return next(err);

      const userId = results.insertId; // Get the ID of the newly registered user
      var table_name;
      // Step 2: Insert into Faculty table using the userId
      if(role == 'faculty'){
         table_name = 'Faculty';
      }
      else {
         table_name = 'MessSupervisor';
      }
      pool.query(
        'INSERT INTO '+ table_name +'(email, name, userId) VALUES (?, ?, ?)', // Insert into Faculty table
        [email, name, userId],
        (err2, results2) => {
          if (err2) return next(err2);

          // Step 3: Send the response with the faculty's userId
          res.json({
            success: true,
            message: table_name + ' added successfully',
            id_new: results2.insertId, // The ID of the newly created faculty record
            userId: userId, // The ID of the user from the User table
          });
        }
      );
    }
  );
};

const addMessRepresntative = (req, res, next) => {
  const { email, password, name, role , messNo} = req.body;
  pool.query(
    'INSERT INTO User (email, password, role) VALUES (?, ?, ?)', // Insert into User table
    [email, password, role], // Assuming role is 'faculty' for faculty members
    (err, results) => {
      if (err) return next(err);

      const userId = results.insertId; // Get the ID of the newly registered user
      var table_name;
      // Step 2: Insert into Faculty table using the userId
      table_name = 'MessRepresentative' ;
      pool.query(
        'INSERT INTO '+ table_name +'(email, name, userId, messNo) VALUES (?, ?, ?, ?)', // Insert into Faculty table
        [email, name, userId, messNo],
        (err2, results2) => {
          if (err2) return next(err2);

          // Step 3: Send the response with the MessRepresentative's userId
          res.json({
            success: true,
            message: table_name + ' added successfully',
            id_new: results2.insertId, // The ID of the newly created faculty record
            userId: userId, // The ID of the user from the User table
          });
        }
      );
    }
  );
};

// Add Mess Details by Admin
const addMess = (req, res, next) => {
  const { name, capacity, location, supervisorId } = req.body;

  // Validate required fields
  if (!name || !capacity || !location || !supervisorId) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Insert Mess details into the database
  const query = `
    INSERT INTO Mess (name, capacity, location, supervisorId)
    VALUES (?, ?, ?, ?)
  `;
  pool.query(query, [name, capacity, location, supervisorId], (err, results) => {
    if (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid supervisor ID provided' });
      }
      return next(err);
    }
    res.json({
      success: true,
      message: 'Mess details added successfully',
      messId: results.insertId,
    });
  });
};

const getMrByMess = (req, res, next) => {
  const { messNo } = req.params;  // Extract messNo from URL parameter

  // Validate if messNo is provided
  if (!messNo) {
    return res.status(400).json({
      success: false,
      message: 'messNo is required',
    });
  }

  // Query to get students from the specified messNo
  const query = 'SELECT email, name FROM MessRepresentative WHERE messNo = ?';

  pool.query(query, [messNo], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No Mess Representatives found for mess ${messNo}`,
      });
    }

    res.json({
      success: true,
      message: `Mess Representative for messNo ${messNo} fetched successfully`,
      students: results, // Array of mr objects
    });
  });
};

const updateMessNoByBatch = (req, res, next) => {
  const { batch, messNo } = req.body;  // Extract batch and mess from the request body

  // Validate if batch and mess are provided
  if (!batch || !messNo) {
    return res.status(400).json({
      success: false,
      message: 'Both batch and mess are required',
    });
  }

  // Query to update mess for students in the specified batch
  const query = 'UPDATE Student SET messNo = ? WHERE batch = ?';

  pool.query(query, [messNo, batch], (err, results) => {
    if (err) return next(err);

    // Check if any rows were affected (if no students with the batch were found)
    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `No students found for batch ${batch}`,
      });
    }

    // If update is successful, respond with success
    res.json({
      success: true,
      message: `mess updated successfully for batch ${batch}`,
    });
  });
};


const updateMessNoByEmail = (req, res, next) => {
  const { email, messNo } = req.body;

  if (!email || messNo === undefined) {
    return res.status(400).json({
      success: false,
      message: "Email and messNo are required",
    });
  }

  const query = "UPDATE Student SET messNo = ? WHERE email = ?";

  pool.query(query, [messNo, email], (err, results) => {
    if (err) return next(err);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found with the provided email",
      });
    }

    res.json({
      success: true,
      message: "messNo updated successfully",
    });
  });
};

const removeMessNoByEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const query = "UPDATE Student SET messNo = NULL WHERE email = ?";

  pool.query(query, [email], (err, results) => {
    if (err) return next(err);

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found with the provided email",
      });
    }

    res.json({
      success: true,
      message: "messNo removed successfully",
    });
  });
};

const addUpvote = (req, res, next) => {
  const { issueId, userId } = req.body;

  // Validate required fields
  if (!issueId || !userId) {
    return res.status(400).json({ success: false, message: "issueId and userId are required" });
  }

  // Insert into the Upvote table
  const query = 'INSERT INTO Upvote (issueId, userId) VALUES (?, ?)';
  pool.query(query, [issueId, userId], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'User has already upvoted this issue' });
      }
      return next(err);
    }

    res.json({
      success: true,
      message: 'Upvote added successfully',
    });
  });
};

const inspectionbymess = (req, res, next) => {
  const { messNo } = req.params; // Get messNo from query parameters

  // Ensure messNo is provided
  if (!messNo) {
    return res.status(400).json({ success: false, message: 'Mess number is required' });
  }

  // Query the Inspection table for records matching the messNo
  pool.query(
    'SELECT * FROM Inspection WHERE messNo = ?',
    [messNo],
    (err, results) => {
      if (err) {
        return next(err); // Pass the error to the next middleware
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'No inspections found for the specified mess' });
      }

      return res.json({ success: true, inspections: results });
    }
  );
};

const feedbackbymess = (req, res, next) => {
  const { messNo } = req.params; // Get messNo from query parameters

  // Ensure messNo is provided
  if (!messNo) {
    return res.status(400).json({ success: false, message: 'Mess number is required' });
  }

  // Query the Issues table for records matching the messNo
  pool.query(
    'SELECT * FROM Feedback where messNo = ? ',
    [messNo],
    (err, results) => {
      if (err) {
        return next(err); // Pass the error to the next middleware
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'No feedback found for the specified mess' });
      }

      return res.json({ success: true, feedback: results });
    }
  );
};

const issuesbymess = (req, res, next) => {
  const { messNo } = req.params; // Get messNo from query parameters

  // Ensure messNo is provided
  if (!messNo) {
    return res.status(400).json({ success: false, message: 'Mess number is required' });
  }

  // Query the Issues table for records matching the messNo
  pool.query(
    'SELECT * FROM Issues where messNo = ? ',
    [messNo],
    (err, results) => {
      if (err) {
        return next(err); // Pass the error to the next middleware
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'No Issues found for the specified mess' });
      }

      return res.json({ success: true, issues: results });
    }
  );
};




module.exports = { addMess , addCoordinator, addMessRepresntative,getMrByMess, updateMessNoByBatch,
  updateMessNoByEmail, removeMessNoByEmail, addUpvote,
  inspectionbymess, feedbackbymess, issuesbymess};

