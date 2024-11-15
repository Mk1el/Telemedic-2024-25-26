const express = require('express');  
const session = require('express-session'); 
const dotenv = require('dotenv');  
const db = require('./config/db');  
const path = require('path');  

dotenv.config({ path: './.env' });  

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

app.post('/doctors_login', (req, res) => {
    res.render('doctors_login');
});

app.get('/doctors_page', (req, res) => {
    res.render('doctors_page');
});

app.get('/patients_page/:id', (req, res) => {
    res.render('patients_page');
});

app.get('/updateProfile', (req, res) => {
    res.render('updateProfile');
});
app.post('/updateProfile', (req, res) => {
    const { first_name, last_name, email, phone } = req.body;
    console.log('Profile updated:', { first_name, last_name, email, phone });
    
     res.redirect('/profile/:id');
});
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        // Redirect the user to login if not authenticated
        return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user });
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
