const { pool } = require('../models/db');

const login = (req, res, next) => {
  const { email, password } = req.body;
  pool.query(
    'SELECT * FROM User WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return next(err);
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      res.json({ success: true, message: 'Login successful', user: results[0] });
    }
  );
};

const register = (req, res, next) => {
  const {name,  email, password, role } = req.body;
  pool.query(
    'INSERT INTO User (email, password, role) VALUES (?, ?, ?)',
    [email, password, role],
    (err, results) => {
      if (err) return next(err);
      const userId = results.insertId; // Get the ID of the newly inserted user
      pool.query(
        'INSERT INTO Student (userId, email, name) VALUES (?, ?, ?)',
        [userId, email, name],
        (err, results) => {
          if (err) return next(err);
          const studentId = results.insertId; // Get the ID of the newly inserted student
          res.json({ success: true, message: 'Registration successful as Student', userid: userId , studentid : studentId});
        }
      );
      // res.json({ success: true, message: 'Registration successful', userid: userId });
      //may add logic to delete if student already exists
    }
  );
};

// module.exports = { login, register };

const testing = (req, res, next) => {
  console.log("IN testing");
  // res.send('Hello from the controller');
  pool.query(
    'SELECT * FROM User WHERE email = ? AND role = ?',
    ['rr200002@rguktrkv.ac.in', "admin"], // Replace with the desired parameters
    (err, results) => {
      if (err) return next(err);
  
      res.json({
        success: true,
        message: 'User retrieved successfully',
        user: results, // This returns all matching rows
      });
      console.log(results);
    }
  );
  
};

module.exports = {testing, login, register} ;