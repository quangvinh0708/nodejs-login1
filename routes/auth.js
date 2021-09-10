const express = require('express');
const path = require('path');
// const { builtinModules } = require('module');
const authController = require('../controllers/auth');



const router = express.Router();    

router.post('/register', authController.register);

router.post('/login', authController.login);
// router.get('/register',(req,res) => {
//     res.render('register');
// });

module.exports = router;