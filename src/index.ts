/* eslint-disable */
import process from 'process';
import express, { Express } from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
// Models before usage in Services and Routers
import './models/User.js';

// Routers after Models
import { router as loginRouter } from './routes/login.router.js'; // TODO need to figure out why we need .js
import { router as userRouter } from './routes/user.router.js';

// Services after Models
import * as passportService from './services/passport.service.js';

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    console.log('Mongoose Connected: ', process.env.MONGO_URI);
    void mongoose.connect(MONGO_URI);
} // void or empty .then()

const app: Express = express(); // Start express before middlewares

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// const SESSION_SECRET = process.env.SESSION_SECRET || '';

/**
 * Order matters
 * Use .urlencoded, .json, session, etc, before app.use(router) -> Our routes setup
 * Calling urlencoded & json to handle the Request Object from POST requests
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Key difference between cookie-session and express-session is how the keys are stored
 * Cookie Session: Cookie IS the session -> Take user ID, find user, set it on req.session
 * Express Session: Cookie references a session -> Take session ID, then look at server side session store
 * Cookie has a small size limit with cookie-sesion compared to bucket of data from express-session. Only care about id
 * Passes into req.session. Cookie expires in 30 days, extracts cookie data to be passed into passport
 */
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIE_KEY || '']
        // secret: SESSION_SECRET
    })
);
app.use(express.static('public'));
app.use(cors());
app.use(helmet());

/** Service Init */
passportService.init(app);
/** Routes Init */
app.use(loginRouter);
app.use(userRouter);

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
