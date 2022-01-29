const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { validPassword } = require('../helpers/functions');
let connection = require('./sql');


const passportFunction = () => {

    const customFields = {
        usernameField: 'uname',
        passwordField: 'pw',
    };


    /*Passport JS*/
    const verifyCallback = (username, password, done) => {
        connection.query('SELECT * FROM users WHERE username = ? ', [username], function (error, results, fields) {
            if (error)
                return done(error);

            if (results.length == 0) {
                return done(null, false);

            }
            const isValid = validPassword(password, results[0].hash, results[0].salt);
            user = { id: results[0].id, username: results[0].username, hash: results[0].hash, salt: results[0].salt };
            if (isValid) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });

    }

    const strategy = new LocalStrategy(customFields, verifyCallback);
    passport.use(strategy);


    passport.serializeUser((user, done) => {
        console.log("inside serialize");
        done(null, user.id)
    });

    passport.deserializeUser(function (userId, done) {
        console.log('deserializeUser' + userId);
        connection.query('SELECT * FROM users where id = ?', [userId], function (error, results) {
            done(null, results[0]);
        });
    })
}


module.exports = passportFunction;