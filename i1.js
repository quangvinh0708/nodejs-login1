const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({
    path: './.env'
})

const app = express();

const mysqlCon = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
})



const publicDirectory = path.join(__dirname,'./public');
// console.log(publicDirectory);
app.use(express.static(publicDirectory));


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');
// const publicDirectory1 = path.join(__dirname,'./auth');
// app.use(express.static(publicDirectory1));

mysqlCon.connect(err => {
    if(err) throw err;
    else console.log("MySQL Connected!");
})

//define routes
app.use('/', require('./routes/pages.js'));
app.use('/auth/', require('./routes/auth'));
// app.post('/auth/register', (req, res) => {
//     console.log(req.body);
//     const { name, email, password, passwordConfirm } = req.body; 

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
//         });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
    console.log("Server started on port 5000!");
})