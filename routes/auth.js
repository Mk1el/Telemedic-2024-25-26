const express = require('express');
const db = require('../config/db'); 
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/register',authController.register)
router.post('/login' ,authController.login)
router.post('/patients_page', authController.patients_page)
router.post('/book_appointment', authController.bookAppointments)
router.put('/updateProfile', authController.updateProfile);
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.findAll(); // Replace with your DB call
        res.json(doctors); // Send JSON response
    } catch (error) {
        console.error('Error fetching doctor list:', error);
        res.status(500).json({ error: 'Unable to fetch doctors' });
    }
});

router.get('/logout', authController.logout);


module.exports = router;