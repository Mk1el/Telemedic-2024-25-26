const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const db = require('./config/db');
const path = require('path');

dotenv.config({ path: './.env' });
const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: '12345678', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Ensure this is false for development (HTTP)
}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/patients_page', (req, res) => {
    res.render('patients_page');
});
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const appointmentRoutes = require('./routes/appointments');
app.use('/appointments' ,appointmentRoutes);
// Ensure routes are correctly set up
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server started on port 5000");
});
