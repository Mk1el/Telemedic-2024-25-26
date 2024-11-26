const db = require('../config/db'); 


exports.adminPage = async (req, res) => {
    try {
        const [patients] = await db.query('SELECT p_id, first_name, last_name, email, phone FROM Patients');
        const [doctors] = await db.query('SELECT d_id, first_name, specialization, email, schedule FROM Doctors');

        // Render the admin page with patients and doctors
        res.render('admin_page', { 
            title: 'Admin Dashboard', 
            patients, 
            doctors 
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error while fetching data');
    }
};
exports.getPatients = async (req, res) => {
    try {
        const [patients] = await db.query("SELECT * FROM Patients"); // Query to fetch patients

        // Render the patients view, passing the fetched patients
        res.render('patients', { title: 'Patients List', patients }); // Adjusted for patients view
    } catch (error) {
        console.error("Error fetching patients:", error.message);
        res.status(500).send('Error fetching patients. Please try again later.');
    }
};

exports.showAddDoctorForm = (req, res) => {
    res.render('add_doctor', { title: 'Add New Doctor' });
};

// Add a new doctor to the database
exports.addDoctor = async (req, res) => {
    const { first_name, specialization,  email, schedule } = req.body;

    try {
        await db.query('INSERT INTO Doctors (first_name, specialization, email, schedule) VALUES (?, ?,  ?, ?)', 
            [first_name, specialization, email, schedule]);

        res.redirect('/admin/doctors'); 
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).send('Server error while adding doctor');
    }
};
exports.getDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query("SELECT * FROM Doctors");
        
        // Log the retrieved doctors to ensure data is fetched
        console.log(doctors);
        
        res.render('doctors', { title: 'Doctors Available', doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).send('Error fetching doctors. Please try again later.');
    }
};
exports.showAddAppointmentForm = (req, res) => {
    res.render('add_appointments', { title: 'Add New Appointment' });
};

exports.addAppointments = async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;

    // Ensure all required fields are present
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !status) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Insert into the database
        await db.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)', 
            [patient_id, doctor_id, appointment_date, appointment_time, status]
        );

        // Redirect to the appointments page
        return res.redirect('/admin/appointments');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Server error while processing request');
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query("SELECT * FROM Appointments"); 

        res.render('appointments', { title: 'Appointments made by Admin', appointments }); 
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).send('Error fetching admin appointments. Please try again later.');
    }
};

exports.getEditDoctorForm = async (req, res) => {
    const d_id = req.params.id;
    try {
        const [doctor] = await db.query("SELECT * FROM Doctors WHERE d_id = ?", [d_id]);
        if (!doctor || doctor.length === 0) {
            return res.status(404).send('Doctor not found');
        } 
        res.render('edit_doctor', { title: 'Edit Doctor', doctor: doctor[0] });
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).send('Error fetching doctor. Please try again later.');
    }
};


exports.deleteDoctor = async (req, res) => {
    const d_id = req.params.d_id;
    try {
        const [result] = await db.execute("DELETE FROM Doctors WHERE d_id = ?", [d_id]);

        if (result.affectedRows > 0) {
            res.redirect('/admin/doctors'); 
        } else {
            res.status(404).send('Doctor not found.');
        }
    } catch (error) {
        console.error("Error deleting doctor:", error.message);
        res.status(500).send('Error deleting doctor. Please try again later.');
    }
};

