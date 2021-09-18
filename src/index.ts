/* eslint-disable */

// http://ec2-3-231-208-118.compute-1.amazonaws.com/3000

// Define our dependencies
import dotenv from 'dotenv';
import process from 'process';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// TODO need to figure out why we need .js
import { router } from './routes/loginRoutes.js';

import express, { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import helmet from 'helmet';
import cors from 'cors';

// todo connect to db
// const userDB: any = {};

const app: Express = express(); // Start express before middlewares

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.TWITCH_CID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = 'sum secret';
const CALLBACK_URL = 'http://localhost:3000/auth/twitch/callback'; // You can run locally with - http://localhost:3000/auth/twitch/callback
const PORT = process.env.PORT || 3000;

/**
 * Use .urlencoded, .json, session, etc, before app.use(router) -> Our routes setup
 * Calling urlencoded & json to handle the Request Object from POST requests
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(express.static('public'));
app.use(cors());
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

passport.serializeUser((user: never, done: any) => {
    done(null, user);
});
passport.deserializeUser((user: never, done: any) => {
    done(null, user);
});

/**
 * Twitch Strategy
 * Authenticate users in our app
 */
passport.use(
    'twitch',
    new OAuth2Strategy(
        {
            authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
            tokenURL: 'https://id.twitch.tv/oauth2/token',
            clientID: TWITCH_CLIENT_ID,
            clientSecret: TWITCH_SECRET,
            callbackURL: CALLBACK_URL,
            state: true
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;

            // console.log(accessToken);
            // console.log(refreshToken);
            // console.log(profile);
            // console.log(done);

            // Securely store user profile in your DB
            //User.findOrCreate(..., function(err, user) {
            //  done(err, user);
            //});
            done(null, profile);
        }
    )
);

// Set route to start OAuth link, this is where you define scopes to request
app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

// Set route for OAuth redirect
app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/fail' }));

// app.get('/user', (req, res) => {
//     console.log('getting user data');
//     res.send(userDB);
// });
//
// app.get('/auth/logout', (req, res) => {
//     userDB = {};
//     res.redirect('/');
// });

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
