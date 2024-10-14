const express = require('express');
const authController = require('../controllers/auth'); 
const appointmentController = require('../controllers/appointmentController');
const router = express.Router();

router.get('/',(req, res)=>{
    res.render('index');
})

router.get('/register',(req,res)=>{
    res.render('register');
});
router.get('/login',(req, res)=>{
    res.render('login');
})
router.get('/patients_page',(req, res)=>{
    res.render('patients_page');
})
router.get('/appointment',(req,res)=>{
    res.render('appointment')
})
router.get('/logout', authController.logout);
module.exports = router;