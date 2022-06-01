import type { NextApiRequest, NextApiResponse } from 'next';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { jsonDb } from '../../config.json';
import verify from '../../utils/verify';

export interface MixInfo {
    inputs: string[];
    mixSessionName: string;
    output: string;
}

const mix = (req: NextApiRequest, res: NextApiResponse) => {
    const db = new JsonDB(new Config(jsonDb, true, false, '/'));

    let mixes: MixInfo[];
    try {
        mixes = db.getData('/mix');
    } catch (e) {
        db.push('/mix', []);
        return res.status(200).json({ mixes: [] });
    }

    res.status(200).json({ mixes: mixes });
};

export default verify(mix, ['GET']);
