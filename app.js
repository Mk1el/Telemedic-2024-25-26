const express = require('express');  // Import express
const session = require('express-session');  // Import express-session
const dotenv = require('dotenv');  // Import dotenv
const db = require('./config/db');  // Import your database connection (if needed)
const path = require('path');  // Import path module

dotenv.config({ path: './.env' });  // Load environment variables from .env file

// Create the Express app
const app = express();

// Set up the public directory for static files
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Set up middleware to parse incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up session middleware
app.use(session({
    secret: '12345678', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Ensure this is false for development (HTTP)
}));

// Set view engine to HBS (Handlebars)
app.set('view engine', 'hbs');

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/doctors_page', (req, res) => {
    res.render('doctors_page');
});

app.get('/patients_page', (req, res) => {
    res.render('patients_page');
});

app.get('/updateProfile', (req, res) => {
    res.render('updateProfile');
});
app.post('/updateProfile', (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    console.log('Profile updated:', { first_name, last_name, email, phone });
    
     res.redirect('/profile');
});
app.get('/doctors_patientpage', (req, res) => {
    res.render('doctors_patientpage');
});

app.get('/book_appointments', (req, res) => {
    res.render('book_appointments');
});

// Admin Routes (make sure this is correct)
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const doctorRoutes = require('./routes/doctors_page');
app.use('/doctors_page',doctorRoutes);
// Admin Page redirect
app.get('/admin_page', (req, res) => {
    res.redirect('/admin/admin_page'); 
});

// Ensure routes are correctly set up
app.use('/', require('./routes/pages'));  
app.use('/auth', require('./routes/auth'));  

// Start the server
app.listen(5000, () => {
    console.log("Server started on port 5000");
});
