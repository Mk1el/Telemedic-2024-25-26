const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/doctors', async (req, res) => {
    try {
        const [doctors] = await db.query('SELECT d_id, first_name, last_name, specialization FROM doctors');
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Server error while fetching doctors');
    }
});
// Book an appointment
router.post('/book', async (req, res) => {
    const { patientId, doctorId, appointmentDate } = req.body;

    try {
        await db.query('INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)', [patientId, doctorId, appointmentDate]);
        res.status(201).send('Appointment booked successfully');
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).send('Server error while booking appointment');
    }
});

// Get upcoming appointments
router.get('/upcoming/:patientId', async (req, res) => {
    const { patientId } = req.params;

    try {
        const [appointments] = await db.query('SELECT * FROM appointments WHERE patient_id = ? AND status = "scheduled"', [patientId]);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Server error while fetching appointments');
    }
});

// Reschedule an appointment
router.put('/reschedule/:id', async (req, res) => {
    const { id } = req.params;
    const { newAppointmentDate } = req.body;

    try {
        await db.query('UPDATE appointments SET appointment_date = ? WHERE id = ? AND status = "scheduled"', [newAppointmentDate, id]);
        res.send('Appointment rescheduled successfully');
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        res.status(500).send('Server error while rescheduling appointment');
    }
});

// Cancel an appointment
router.delete('/cancel/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('UPDATE appointments SET status = "canceled" WHERE id = ?', [id]);
        res.send('Appointment canceled successfully');
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).send('Server error while canceling appointment');
    }
});

module.exports = router;
