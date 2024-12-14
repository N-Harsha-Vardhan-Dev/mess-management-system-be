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

// module.exports = { addCoordinator };
  
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

module.exports = { addMess , addCoordinator, addMessRepresntative};
// module.exports = { addMessRepresntative };
// module.exports = { registerMR, createRoles, approveMR, addCoordinator };

