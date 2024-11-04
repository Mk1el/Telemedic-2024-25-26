const express = require('express');
const authController = require('../controllers/auth'); 
const appointmentController = require('../controllers/appointmentController');
const adminController = require('../controllers/adminController');
const db = require('../config/db'); // Ensure you import your db connection
const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.render('index');
});

// Registration route
router.get('/register', (req, res) => {
    res.render('register');
});

// About route
router.get('/about', (req, res) => {
    res.render('about');
});

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

// Doctors login route
router.get('/doctors_login', (req, res) => {
    res.render('doctors_login');
});

// Patients page route with database query

// A doctor page route
router.get('/a_doctor_page', (req, res) => {
    res.render('a_doctor_page');
});
router.get('/doctors_patientpage',(req,res)=>{
    res.render('doctors_patientpage');
})
// Book appointments route
router.get('/book_appointments', (req, res) => {
    res.render('book_appointments');
});

// Logout route
router.get('/logout', authController.logout);

// Export the router
module.exports = router;
