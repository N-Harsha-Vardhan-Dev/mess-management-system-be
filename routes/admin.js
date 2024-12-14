const express = require('express');
const {addMess, addCoordinator, addMessRepresntative } = require('../controllers/adminController');
const router = express.Router();

// router.post('/register-mr', registerMR);
// router.post('/roles', createRoles);
// router.post('/approve-mr/:id', approveMR);
router.post('/addCoordinator', addCoordinator);
router.post('/addMess', addMess) ;
router.post('/addMR', addMessRepresntative);


module.exports = router;
