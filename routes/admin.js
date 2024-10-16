const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route for the admin dashboard
router.get('/admin_page', adminController.adminPage);
router.get('/add_doctor', adminController.showAddDoctorForm);
router.post('/add_doctor', adminController.addDoctor);
router.get('/add_appointments', adminController.showAddAppointmentForm);
router.post('/add_appointments',adminController.addAppointments);
module.exports = router;
