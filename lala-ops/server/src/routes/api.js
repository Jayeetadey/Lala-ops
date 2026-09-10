const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');
const dashboardController = require('../controllers/dashboardController');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Lala Ops API is running'
  });
});

// Dashboard
router.get('/dashboard', dashboardController.getDashboardStats);

// Requests
router.post('/requests', requestsController.createRequest);
router.get('/requests', requestsController.getRequests);
router.get('/requests/:id', requestsController.getRequestById);
router.put('/requests/:id/status', requestsController.updateStatus);
router.put('/requests/:id/assign', requestsController.assignEmployee);

module.exports = router;
