const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs');
const db = require('../config/db');

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

exports.patients_page = async (req, res) => {
    if (!req.session.patientId) {
        return res.redirect('/login'); 
    }

    try {
        const patientId = req.session.patientId;

        
        const [patients] = await db.query('SELECT first_name, last_name, phone, date_of_birth, gender, address FROM patients WHERE id = ?', [patientId]);

        // Check if patient exists
        if (patients.length === 0) {
            return res.status(404).send('Patient not found');
        }

        // Render the patients page with patient details
        res.render('patients_page', { patient: patients[0] });
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return res.status(500).send('Server error while fetching patient data');
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


