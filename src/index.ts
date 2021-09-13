/*
 TODO
  Set environment variables for production
  Add typings
 */

// Define our dependencies
import dotenv from 'dotenv';
import process from 'process';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-oauth';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.TWITCH_CID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = 'sum secret';
const CALLBACK_URL = 'http://localhost:3000/auth/twitch/callback'; // You can run locally with - http://localhost:3000/auth/twitch/callback

//const userDB: any = {};

const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: never, done: any) => {
    done(null, user);
});
passport.deserializeUser((user: never, done: any) => {
    done(null, user);
});

// Twitch Strategy
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

app.get('/', (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    // res.send('<h1>Hello from the TypeScript world! </h1>');
    if (req.session /*&& req.session.passport && req.session.passport.user*/) {
        // res.send(template(req.session.passport.user));
        // Authenticated
        res.send(`SIGNED IN - PORT ${PORT}, NODE:${process.env.NODE_ENV}`);
    } else {
        // res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
        res.send(`PORT ${PORT}, NODE:${process.env.NODE_ENV}`);
    }
});

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
