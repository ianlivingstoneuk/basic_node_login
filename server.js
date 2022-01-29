require('dotenv').config();
const passportFunction = require('./configure/passport');
const passport = require('passport');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const loginRouter = require('./routes/loginRouter');
const indexRouter = require('./routes/indexRouter');
const expressLayouts = require('express-ejs-layouts');
let session = require('express-session');
let MySQLStore = require('express-mysql-session')(session);

/*Mysql Express Session*/
app.use(session({
    key: 'ebay_login_cookie',
    secret: 'jimmythecat',
    store: new MySQLStore({
        host: 'localhost',
        user: 'root',
        password: 'Iannamb123!',
        database: 'cookie_user'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,

    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/assets', express.static('public'));

// View engine
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// Include passport js
passportFunction()

/*routes*/
app.use('/', loginRouter);
app.use('/app', indexRouter);

let port = process.env.PORT || 5000;

app.listen(port, (req, res) => console.log(`Listening on port ${port}`))