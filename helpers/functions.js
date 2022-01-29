const crypto = require('crypto');
let connection = require('../configure/sql')

const validPassword = (password, hash, salt) => {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return hash === hashVerify;
}

const genPassword = password => {
    var salt = crypto.randomBytes(32).toString('hex');
    var genhash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return { salt: salt, hash: genhash };
}


const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/notAuthorized');
    }
}


const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin == 1) {
        next();
    }
    else {
        res.redirect('/notAuthorizedAdmin');
    }
}

const userExists = (req, res, next) => {
    connection.query('Select * from users where username=? ', [req.body.uname], function (error, results, fields) {
        if (error) {
            console.log(error + "Error");
        }
        else if (results.length > 0) {
            res.redirect('/userAlreadyExists')
        }
        else {
            next();
        }

    });
}



module.exports = {
    validPassword,
    genPassword,
    isAuth,
    isAdmin,
    userExists
}