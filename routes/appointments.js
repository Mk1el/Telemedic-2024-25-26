const express = require('express');
const authController = require('../controllers/auth');
const appointmentController = require('../controllers/appointmentController')
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route to handle form submission
router.post('/book_appointments', authController.book_appointments)
router.post('/create_appointment', appointmentController.addAppointment)
module.exports = router;
