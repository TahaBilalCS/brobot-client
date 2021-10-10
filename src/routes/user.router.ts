/* eslint-disable */
/** User router in index.ts */
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

// Current logged in user
router.get('/api/current_user', (req: any, res: any) => {
    // Regardless, send empty object back if user isn't defined
    // res.send(req.session); // Check if session is correct
    res.send(req.user);
});

// Current logged in user
router.get('/api/secret', requireAuth, (req: any, res: any) => {
    // Regardless, send empty object back if user isn't defined
    // res.send(req.session); // Check if session is correct
    res.send(req.user);
});

// TODO need to wire up schema in user service
// router.get('/api/users', requireAuth, async (req: any, res: any, next) => {
//     /** router -> controller -> service */
//     await userController.getUsers(req, res, next);
// });
// router.get('/api/users', requireAuth, userController.getUsers);

export { router };
