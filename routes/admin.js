const express = require('express');
const {addMess, addCoordinator, addMessRepresntative, updateMessNoByBatch, getMrByMess ,
    updateMessNoByEmail, removeMessNoByEmail, addUpvote,
    inspectionbymess, feedbackbymess, issuesbymess
} = require('../controllers/adminController');
const { route } = require('./student');
const router = express.Router();

// router.post('/register-mr', registerMR);
// router.post('/roles', createRoles);
// router.post('/approve-mr/:id', approveMR);
router.post('/addCoordinator', addCoordinator);
router.post('/addMess', addMess) ;
router.post('/addMR', addMessRepresntative);
router.get('/mrbymess/:messNo', getMrByMess);
router.put('/updatemessbybatch', updateMessNoByBatch);
router.put('/updatemessbyemail', updateMessNoByEmail);
router.put('/removemessbyemail', removeMessNoByEmail);
router.post('/addupvote', addUpvote) ;
router.get('/issuesbymess/:messNo', issuesbymess);
router.get('/inspectionbymess/:messNo', inspectionbymess);
router.get('/feedbackbymess/:messNo', feedbackbymess);

module.exports = router;
