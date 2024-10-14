const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/register',authController.register)
router.post('/login' ,authController.login)
router.post('/patients_page', authController.patients_page)
router.get('/logout', authController.logout);
module.exports = router;