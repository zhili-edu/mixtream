import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { jwtSecret, streamInfo } from '../../../config.json';

export interface StreamInfo {
    appName: string;
    names: string[];
}

const index = (req: NextApiRequest, res: NextApiResponse<StreamInfo | ''>) => {
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
        appName: streamInfo.appName,
        names: streamInfo.names,
    });
};

export default index;
