const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const express = require('express');
const router = express.Router();
// doctorsController.js
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the doctor exists by email
        const [results] = await db.query('SELECT * FROM doctor_login WHERE email = ?', [email]);

        // If no doctor found
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        // Store doctor ID in session for authenticated access
        req.session.dId = user.d_id; // Make sure d_id matches your column name in the DB
        return res.redirect('/doctors_page'); // Redirect to doctors' dashboard or homepage

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Server error during login'); // Handle errors
    }
};
exports.doctors_page = async (req, res) => {
    if (!req.session.patientId) {
        return res.redirect('/login');
    }

    try {
        const patientId = req.session.patientId;

        // Fetch patient information
        const [patients] = await db.query('SELECT first_name, last_name, phone, date_of_birth, gender, address FROM patients WHERE patient_id = ?', [patientId]);

        // Fetch doctor schedule information
        const [doctors] = await db.query('SELECT doctor_id, name, specialty, email, available_days FROM Doctors');


        // Check if patient exists
        if (!patients || patients.length === 0) {
            return res.status(404).send('Patient not found');
        }

        // Render the page and pass both patient and doctor data to the view
        res.render('patient_page', {
            patient: patients[0],  // Patient data
            doctors: doctors       // Doctor data
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).send('Error fetching patient or doctor data');
    }
};

