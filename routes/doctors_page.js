const db = require('../config/db'); 
const express = require('express');  
const router = express.Router(); 
const doctorsController = require('../controllers/doctorsController');

router.post('/doctors_login', doctorsController.login);
router.post('/doctors_page', doctorsController.doctors_page)

module.exports = router;