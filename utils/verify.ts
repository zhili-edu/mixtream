import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config.json';

const verify =
    (handler: NextApiHandler, method?: string[]): NextApiHandler =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.headers.authorization)
            return res.status(401).json({ error: 'Unauthorized' });

        const bearer = req.headers.authorization.split(' ')[1];
        try {
            jwt.verify(bearer, jwtSecret);
        } catch (e: any) {
            console.log(e);
            return res.status(403).json({
                error: 'Forbidden',
            });
        }

        if (method && req.method && !method.includes(req.method))
            return res.status(404).json({
                error: 'Not Found',
            });

        await handler(req, res);
    };

export default verify;
