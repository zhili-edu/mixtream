import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { jwtSecret, streamInfo } from '../../config.json';

export interface CredentialInfo {
    pushDomain: string;
    playDomain: string;
    secretId: string;
    secretKey: string;
}

const info = (
    req: NextApiRequest,
    res: NextApiResponse<CredentialInfo | ''>
) => {
    if (req.method !== 'GET') return res.status(400).send('');
    if (!req.headers.authorization) return res.status(401).send('');

    const bearer = req.headers.authorization.split(' ')[1];
    try {
        jwt.verify(bearer, jwtSecret);
    } catch (e: any) {
        console.log(e);
        return res.status(403).send('');
    }

    res.send({
        pushDomain: streamInfo.pushDomain,
        playDomain: streamInfo.playDomain,
        secretId: streamInfo.secretId,
        secretKey: streamInfo.secretKey,
    });
};

export default info;
