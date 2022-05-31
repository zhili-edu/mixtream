import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { jwtSecret, passphrase } from '../../config.json';

const auth = (req: NextApiRequest, res: NextApiResponse<string>) => {
    if (req.body !== passphrase) return res.status(403).send('');

    // expires 1 day from now.
    const token = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 },
        jwtSecret
    );

    return res.send(token);
};

export default auth;
