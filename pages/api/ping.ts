import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const ping = (req: NextApiRequest, res: NextApiResponse) => {
    const db = new JsonDB(new Config('test-db', true, false, '/'));
    try {
        const pong = db.getData('/ping');
        res.status(200).send(pong);
    } catch (e) {
        db.push('/ping', 'pong');
        res.status(200).send('pong');
    }
};

export default ping;
