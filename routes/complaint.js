const express = require('express');
// const { viewComplaints, resolveComplaint, escalateComplaint } = require('../controllers/complaintController');
const { getFeedback, 
    provideInspection , getInspection, getInspectionByDate, getInspectionDates,
     getIssues , updateIssueCount, updateIssueStatus, getIssuesByUserId} = require('../controllers/complaintController');

const router = express.Router();

// router.get('/', viewComplaints);
// router.post('/resolve/:id', resolveComplaint);
// router.post('/escalate/:id', escalateComplaint);
router.get('/feedback', getFeedback);
router.post('/inspection', provideInspection) ;
router.get('/inspection', getInspection);
router.get('/issues', getIssues);
router.put('/issues/count/:issueId', updateIssueCount);
router.put('/issues/status/:issueId', updateIssueStatus);
router.get('/issues/user/:userId', getIssuesByUserId);
router.get('/inspection/:inspectionDate', getInspectionByDate);
router.get('/inspection/dates', getInspectionDates);

module.exports = router;
