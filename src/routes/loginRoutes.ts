/* eslint-disable */
import process from 'process';
import { Router, Request, Response, NextFunction } from 'express';

// Because of body parser's lack of type, Interface now has all the same properties as Request. Overrides Request.body
interface RequestWithBody extends Request {
    // Body object with some unknown keys that are strings, and their values will either be a string | undefined
    body: { [key: string]: string | undefined };
}

/**
 * Middleware for requiring authentication
 * @param req
 * @param res
 * @param next
 */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session.loggedIn) {
        next();
        return;
    }

    res.status(403);
    res.send('Not permitted');
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
    // res.send('<h1>Hello from the TypeScript world! </h1>');
    if (req.session.loggedIn /*&& req.session.passport && req.session.passport.user*/) {
        // User authenticated
        res.send(`
            <h1>SIGNED IN</h1> - PORT: -, NODE:${process.env.NODE_ENV}
            <a href='/logout'>Logout</a>
        `);
    } else {
        // res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
        res.send(`
        PORT: -, NODE:${process.env.NODE_ENV}
        <a href='/login'>Login</a>
        `);
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

router.post('/login', (req: RequestWithBody, res: Response) => {
    const { email, password } = req.body;

    if (email && password && email === 'hi' && password === 'pass') {
        req.session.loggedIn = true; // User logged in
        res.redirect('/'); // Redirect to root route
    } else {
        res.send('Invalid email or password');
    }
});

router.get('/logout', (req: Request, res: Response) => {
    req.session.loggedIn = undefined;
    res.redirect('/');
});

// Apply middleware first
router.get('/protected', requireAuth, (req: Request, res: Response) => {
    res.send(`
            <h1>SIGNED IN</h1> 
            <a href='/logout'>Logout</a>
        `);
});
// Curly brace when declaration (const router = Router) and export are not on the same line. It's an already created var
export { router };
