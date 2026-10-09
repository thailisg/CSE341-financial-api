require('dotenv').config();
const express = require('express');

const mongodb = require('./data/database');
const bodyParser = require('body-parser');

const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

//body-parser
app.use(bodyParser.json());

//session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName}`
            : 'Logged Out'
    );
});

//github callback
app.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/api-docs'
    }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);

app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if(err){
        console.log(err);
    }else{
        app.listen(port, () => (console.log(`Database is listening and node Running on port ${port}`)));
    }
});