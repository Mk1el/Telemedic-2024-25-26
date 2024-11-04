const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const adminController = require('../controllers/adminController');

router.get('/patients',adminController.getPatients);
router.get('/doctors',adminController.getDoctors);
router.get('/add_doctor', adminController.showAddDoctorForm);
router.post('/add_doctor', adminController.addDoctor);
router.put('/doctors/:d_id', adminController.getEditDoctorForm); 
router.delete('/doctors/:d_id', adminController.deleteDoctor);
router.get('/add_appointments', adminController.showAddAppointmentForm);
router.post('/add_appointments',adminController.addAppointments);
router.get('/appointments' ,adminController.getAppointments);

// Route to get counts and render the admin dashboard
router.get('/admin/dashboard', async (req, res) => {
    try {
        const [patientCount] = await db.query('SELECT COUNT(*) as count FROM patients');
        const [doctorCount] = await db.query('SELECT COUNT(*) as count FROM doctors');
        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM appointments');

        res.render('admin_page', {
            title: 'Admin Dashboard',
            totalPatients: patientCount[0].count,
            totalDoctors: doctorCount[0].count,
            totalAppointments: appointmentCount[0].count
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).send('Server error while fetching counts');
    }
});

// If you want to keep the previous /admin_page route, you can simply modify it like so:
router.get('/admin_page', async (req, res) => {
    try {
        const [patientCount] = await db.query('SELECT COUNT(*) AS total_patients FROM patients');
        const [doctorCount] = await db.query('SELECT COUNT(*) AS total_doctors FROM doctors');
        const [appointmentCount] = await db.query('SELECT COUNT(*) AS total_appointments FROM appointments');

        res.render('admin_page', {
            title: 'Admin Page',
            totalPatients: patientCount[0].total_patients,
            totalDoctors: doctorCount[0].total_doctors,
            totalAppointments: appointmentCount[0].total_appointments
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});


module.exports = router;
