const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const router = express.Router();

const mysqlCon = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        mysqlCon.query('SELECT * FROM USERS WHERE EMAIL = ?', [email], async (err, results) => {
            
            console.log(results);

            if (results.length < 1) {
                res.status(401).render('login', {
                    message: 'This email is unregistered!'
                })
            }
            if( !( await bcrypt.compare(password, results[0].PASSWORD) ) ){
                res.status(401).render('login', {
                    message: 'Email or password is incorrect!'
                })
            }
            // if (!results || !(await bcrypt.compare(password, results[0].PASSWORD))) {
            //     res.status(401).render('login', {
            //         message: 'Email or password is incorrect!'
            //     })
            // }
            else {
                const id = results[0].ID;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is : " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }

        });

    } catch (error) {
        console.log(err);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const t = {
        a: 5,
        b: 6,
        c: 7
    }
    const { a, b, c } = t;

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const password = req.body.passwordConfirm;

    const { name, email, password, passwordConfirm } = req.body;

    mysqlCon.query('SELECT EMAIL FROM USERS where EMAIL = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        }
        if (results.length > 0) {
            // console.log((!results) + " " + results.length);
            return res.render('register', {
                message: 'That email is already in use'
            });
        }
        else if (password !== passwordConfirm) {
            // console.log((results==false) + " " + results.length);
            return res.render('register', {
                message: 'Password do not match'
            });
        }

        let hashPassword = await bcrypt.hash(password, 8);
        console.log(hashPassword);

        mysqlCon.query('INSERT INTO USERS SET ?', { NAME: name, EMAIL: email, PASSWORD: hashPassword }, (err, results) => {
            if (err) console.log(err);
            else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered successfully!'
                })
            }
        })



    });



}