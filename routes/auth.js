const express = require('express');
const {testing, login, register } = require('../controllers/authController');
const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.get('/test', testing); // Pass the function directly as the callback

module.exports = router;
