const express = require('express');
const authController = require('../controllers/auth');
const appointmentController = require
const router = express.Router();
// Route to handle form submission
router.post('/book_appointments', authController.book_appointments)

module.exports = router;
