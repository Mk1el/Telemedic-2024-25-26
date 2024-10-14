const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const appointmentController = require('../controllers/appointmentController')
// Route for the admin dashboard
router.get('/admin_page', adminController.adminPage);
router.get('/add_doctor', adminController.showAddDoctorForm);
router.post('/add_doctor', adminController.addDoctor);
router.get('/doctors', adminController.getDoctors);
router.get('/appointment',appointmentController.createAppointment);
module.exports = router;
