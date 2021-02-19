import { Router, Request, Response } from 'express';
import { User as UserModel } from '../models/User';
import { User } from '../types/userTypes';

export const router: Router = Router();

router.post('/user', async (req: Request<{}, {}, User>, res: Response) => {
    try {
        const user = new UserModel(req.body);
        await user.save();
        res.send(user);
    } catch (err) {
        // maybe log error to discord?
        res.status(500).send(err);
    }
});
