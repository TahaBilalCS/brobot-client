/* eslint-disable */
/** Use controllers in router */
import * as userService from '../services/user.service.js';
import { NextFunction } from 'express';

export const getUsers = async (req: Request, res: any, next: NextFunction) => {
    try {
        const users = await userService.getUsers();
        res.send(users);
    } catch (err) {
        console.log('Error getting users', err);
        next(err);
    }
};

export const getUser = async (req: any, res: any, next: NextFunction) => {
    try {
        const users = await userService.getUser(req.user.id);
        res.send(users);
    } catch (err) {
        console.log('Error getting users', err);
        next(err);
    }
};
