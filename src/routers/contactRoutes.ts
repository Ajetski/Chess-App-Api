import { Router, Request, Response } from 'express';
import axios from 'axios';
export const router = Router();

router.post('/contact', async (req: Request<{}, {}, { text: string }>,
    res: Response) => {
    axios.post(process.env.LOGGER_WEBHOOK,
        { content: req.body.text }).then(
            () => {
                res.send({ delivered: true });
            }).catch((err) => {
                res.status(500).send(err);
            });
});