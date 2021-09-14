/* eslint-disable */
import process from 'process';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req, res) => {
    // res.send('<h1>Hello from the TypeScript world! </h1>');
    if (req.session /*&& req.session.passport && req.session.passport.user*/) {
        // Authenticated
        res.send(`<h1>SIGNED IN</h1>- PORT: -, NODE:${process.env.NODE_ENV}`);
    } else {
        // res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
        res.send(`PORT: -, NODE:${process.env.NODE_ENV}`);
    }
});

router.get('/login', (req, res) => {
    res.send(`
<form method='POST'>
    <div>
        <label>Email</label>
        <input name='email'/>
    </div>
    <div>
        <label>Password</label>
        <input name='password' type='password' />
    </div>
    <button>Submit</button>
</form>`);
});

router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    res.send(email + password);
});

// Curly brace when declaration (line 6) and export are not on the same line. It's an already created var
export { router };
