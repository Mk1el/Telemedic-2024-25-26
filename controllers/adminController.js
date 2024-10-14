const db = require('../config/db'); // Ensure the path to your db config is correct

// Admin dashboard showing patients and doctors
exports.adminPage = async (req, res) => {
    try {
        // Fetch patients
        const [patients] = await db.query('SELECT p_id, first_name, last_name, email, phone FROM Patients');

        // Fetch doctors
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

// Show the form to add a new doctor
exports.showAddDoctorForm = (req, res) => {
    res.render('add_doctor', { title: 'Add New Doctor' });
};

// Add a new doctor to the database
exports.addDoctor = async (req, res) => {
    const { first_name, specialization, email, schedule } = req.body;

    try {
        await db.query('INSERT INTO Doctors (first_name, specialization, email, schedule) VALUES (?, ?, ?, ?)', 
            [first_name, specialization, email, phone, schedule]);

        res.redirect('/admin/doctors'); 
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).send('Server error while adding doctor');
    }
};

// Get the list of doctors
exports.getDoctors = async (req, res) => {
    try {
        const [doctors] = await db.query("SELECT * FROM Doctors"); // Adjusted to use query method correctly

        // Render the doctors view, passing the fetched doctors
        res.render('doctors', { title: 'Doctors List', doctors }); // Remove '/views'
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).send('Error fetching doctors. Please try again later.');
    }
};
