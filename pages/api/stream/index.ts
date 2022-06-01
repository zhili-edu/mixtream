import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonDb } from '../../../config.json';
import verify from '../../../utils/verify';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

export interface StreamInfo {
    names: string[];
}

const index = (req: NextApiRequest, res: NextApiResponse<StreamInfo>) => {
    const db = new JsonDB(new Config(jsonDb, true, false, '/'));

    let streams: string[];
    try {
        streams = db.getData('/stream');
    } catch (e) {
        db.push('/stream', []);
        return res.status(200).json({ names: [] });
    }

    res.json({
        names: streams,
    });
};

export default verify(index, ['GET']);
