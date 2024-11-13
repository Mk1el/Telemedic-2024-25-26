const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const express = require('express');
const router = express.Router();


exports.register = async (req, res) => {
    console.log(req.body);
    
    const { first_name, last_name, email, password_hash, phone, date_of_birth, gender, address } = req.body;

    try {
        // Check if the email already exists
        const [results] = await db.query('SELECT email FROM patients WHERE email = ?', [email]);

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email has been used!'
            });
        } 
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        console.log(hashedPassword);

        // Insert new patient into the database
        await db.query(
            'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
        );

        console.log('Patient registered successfully');
        return res.render('register', {
            message: 'Patient registered!'
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).send('Server error during registration'); 
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists by email
        const [results] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);

        // If no user found
        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        req.session.patientId = user.id; // Store patient ID in session
        return res.redirect('/patients_page'); // Redirect to the patients page

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Server error during login'); // Handle errors
    }
};

// Assuming you're checking for session data to verify if the user is logged in
exports.patients_page = async (req, res) => {
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

exports.updateProfile = async (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    const patientId = req.session.patientId; // Assuming patientId is stored in session

    if (!patientId) {
        console.log("Patient ID not found in session.");
        return res.status(401).send("Please log in to update your profile.");
    }

    try {
        // Make sure the inputs are not empty
        if (!first_name || !last_name || !email || !phone) {
            return res.status(400).send("All fields are required.");
        }

        // Update the patient data in the database
        const [result] = await db.query(`
            UPDATE patients
            SET first_name = ?, last_name = ?, email = ?, phone = ?
            WHERE id = ?
        `, [first_name, last_name, email, phone, patientId]);

        // If no rows are affected, it means no patient was found with that ID
        if (result.affectedRows === 0) {
            console.log(`Patient with ID ${patientId} not found.`);
            return res.status(404).send("Patient not found.");
        }

        console.log("Profile updated successfully for patient ID:", patientId);
        // Send success response
        res.status(200).send("Profile updated successfully.");
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Error updating profile.");
    }
};

exports.getDoctors = async (req, res) => {
    try {
        // Fetch all doctors from the database
        const [doctors] = await db.query("SELECT doctor_id, name FROM Doctors");

        // Log the fetched doctors (optional for debugging)
        console.log(doctors);

        // Pass doctors data to the view
        res.render('patients_page', {
            title: 'Doctors Available',
            doctors // This is the array of doctors that will be passed to the view
        });
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).send('Error fetching doctors. Please try again later.');
    }
};

exports.bookAppointments = async (req, res) => {
    const { user_id, doctor_id, appointment_date, appointment_time, notes, duration } = req.body;

    try {
        const sql = `
            INSERT INTO Appointments (user_id, doctor_id, appointment_date, appointment_time, notes, duration)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [user_id, doctor_id, appointment_date, appointment_time, notes, duration]);
        
        res.status(200).send('Appointment booked successfully');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Error booking appointment');
    }
};
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Server error during logout');
        }
        res.redirect('/login'); 
    });
};
router.get('/doctors/:doctorId', async (req, res) => {
    const doctorId = req.params.doctorId;

    try {
        // Fetch doctor data based on the provided doctorId
        const [doctor] = await db.query('SELECT doctor_id, name, specialty, status, available_days, available_time FROM Doctors WHERE doctor_id = ?', [doctorId]);

        // Check if doctor data is found
        if (doctor.length === 0) {
            return res.status(404).send('Doctor not found');
        }

        // Send doctor details as JSON
        res.json(doctor[0]);
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).send('Error fetching doctor details');
    }
});


