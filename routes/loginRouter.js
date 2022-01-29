const express = require('express');
const { genPassword, isAuth, isAdmin, userExists } = require('../helpers/functions');
const router = express.Router()
const passport = require('passport');
const connection = require('../configure/sql')

router.get('/', (req, res) => {
    res.render('login', { title: 'Login' })
});

router.get('/login', (req, res, next) => {
    res.render('login', { title: 'Login' })
});
router.get('/logout', (req, res, next) => {
    req.logout(); //delets the user from the session
    res.redirect('/protected-route');
});
router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

router.post('/register', userExists, (req, res, next) => {
    const saltHash = genPassword(req.body.pw);
    const salt = saltHash.salt;
    const hash = saltHash.hash;


    connection.query('Insert into users(username,hash,salt,isAdmin) values(?,?,?,0) ', [req.body.uname, hash, salt], function (error, results, fields) {
        if (error) {
            console.log("Error");
        }
        else {
            console.log("Successfully Entered");
        }
    });

    res.redirect('/login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/app'
}));

router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('<h1>You are admin</h1><p><a href="/logout">Logout and reload</a></p>');
});

router.get('/notAuthorized', (req, res, next) => {
    res.send('<h1>You are not authorized to view the resource </h1><p><a href="/login">Retry Login</a></p>');

});
router.get('/notAuthorizedAdmin', (req, res, next) => {
    res.send('<h1>You are not authorized to view the resource as you are not the admin of the page  </h1><p><a href="/login">Retry to Login as admin</a></p>');

});
router.get('/userAlreadyExists', (req, res, next) => {
    res.send('<h1>Sorry This username is taken </h1><p><a href="/register">Register with different username</a></p>');

});

module.exports = router;






