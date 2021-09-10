const express = require('express');
const { builtinModules } = require('module');
const mysql = require('mysql'); 

const router = express.Router();

const mysqlCon = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
})

router.get('/',(req,res) => {
    res.render('index');
});

router.get('/register',(req,res) => {
    res.render('register');
});

router.get('/login',(req,res) => {
    res.render('login');
});

// router.post('/register1', (req,res) => {
//     const { name, email, password ,passwordConfirm } = req.body; 
//         mysqlCon.query('SELECT EMAIL FROM USERS where EMAIL = ?', [email], async (err,results) => {
//             if(err){
//                 console.log(err);
//             }
//             if( results.length > 0 ){
//                 return res.render('register', {
//                     message: 'That email is already in use'
//                 });
//             }
//             else if( password !== passwordConfirm ){
//                 return res.render('register', {
//                     message: 'Password do not match'
//                 });
//             }
//             let hashPassword = await bcrypt.hash(password, 8);
//             console.log(hashPassword);
// })
// })

module.exports = router;