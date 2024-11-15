const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const express = require('express');
const router = express.Router();

// Create Appointment
exports.addAppointment = (req, res) => {
    const { p_id, d_id, appointment_date, appointment_time, status } = req.body;

    const query = 'INSERT INTO Appointments (p_id, d_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)';
    pool.query(query, [patient_id, doctor_id, appointment_date, appointment_time, 'scheduled'], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Appointment scheduled successfully');
    });
};

// Read Appointments
exports.getAppointments = (req, res) => {
    const patientId = req.session.patientId;

    const query = 'SELECT a.id, d.first_name AS doctor_first_name, a.appointment_date, a.appointment_time, a.status FROM Appointments a JOIN Doctors d ON a.doctor_id = d.id WHERE a.patient_id = ?';
    pool.query(query, [patientId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

// Update Appointment
exports.updateAppointment = (req, res) => {
    const { appointment_id, new_date, new_time } = req.body;

    const query = 'UPDATE Appointments SET appointment_date = ?, appointment_time = ? WHERE id = ? AND status = ?';
    pool.query(query, [new_date, new_time, appointment_id, 'scheduled'], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Appointment rescheduled successfully');
    });
};

// Cancel Appointment
exports.cancelAppointment = (req, res) => {
    const { appointment_id } = req.body;

    const query = 'UPDATE Appointments SET status = ? WHERE id = ? AND status = ?';
    pool.query(query, ['canceled', appointment_id, 'scheduled'], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Appointment canceled successfully');
    });
};

// Get Upcoming Appointments for Doctors (Admin or Doctor Role)
exports.getDoctorAppointments = (req, res) => {
    const doctorId = req.session.doctorId; // Assuming doctor ID is stored in session for logged-in doctors

    const query = 'SELECT a.id, p.first_name AS patient_first_name, p.last_name AS patient_last_name, a.appointment_date, a.appointment_time, a.status FROM Appointments a JOIN Patients p ON a.patient_id = p.id WHERE a.doctor_id = ?';
    pool.query(query, [doctorId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
