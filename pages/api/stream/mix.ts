import type { NextApiRequest, NextApiResponse } from 'next';
import { getSignedHeaders } from '../../../api/utils';
import { streamInfo } from '../../../config.json';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import type { MixInfo } from '../mix';
import verify from '../../../utils/verify';
import { jsonDb } from '../../../config.json';

export interface CreateMixReq {
    inputs: string[];
    mixSessionName: string;
    output: string;
}

export interface DeleteMixReq {
    mixSessionName: string;
}

const createMix = async (newMix: CreateMixReq): Promise<MixInfo> => {
    const db = new JsonDB(new Config(jsonDb, true, false, '/'));
    let mixes: MixInfo[];
    try {
        mixes = db.getData('/mix');
    } catch (e) {
        db.push('/mix', []);
        mixes = [];
    }

    if (mixes.some((mix) => mix.mixSessionName === newMix.mixSessionName))
        throw new Error('Mix Session Already Exist');
    if (mixes.some((mix) => mix.output === newMix.output))
        throw new Error('Mix Output Already Exist');

    const body = JSON.stringify({
        MixStreamSessionId: newMix.mixSessionName,
        InputStreamList: [
            {
                InputStreamName: 'bg',
                LayoutParams: {
                    ImageLayer: 1,
                    InputType: 3,
                    ImageHeight: 1080,
                    ImageWidth: 1920,
                    LocationX: 0,
                    LocationY: 0,
                    Color: '0x000000',
                },
            },
            ...newMix.inputs.map((name: string, idx: number) => ({
                InputStreamName: name,
                LayoutParams: {
                    ImageLayer: idx + 2,
                    InputType: 5,
                    ImageHeight: 360,
                    ImageWidth: 640,
                    LocationX: (idx % 3) * 640,
                    LocationY: Math.floor(idx / 3) * 360,
                },
            })),
        ],
        OutputParams: {
            OutputStreamName: newMix.output,
            OutputStreamType: 1,
        },
    });

    const res = await fetch('https://live.tencentcloudapi.com', {
        method: 'POST',
        body,
        headers: getSignedHeaders(
            body,
            { secretId: streamInfo.secretId, secretKey: streamInfo.secretKey },
            'CreateCommonMixStream'
        ),
    })
        .then((res) => res.json())
        .then((json) => json.Response);

    if (res.Error) {
        throw res.Error;
    } else {
        db.push('/mix[]', newMix);
        return newMix;
    }
};

const deleteMix = async ({ mixSessionName }: DeleteMixReq): Promise<void> => {
    const db = new JsonDB(new Config(jsonDb, true, false, '/'));
    let mixes: MixInfo[];
    try {
        mixes = db.getData('/mix');
    } catch (e) {
        db.push('/mix', []);
        mixes = [];
    }

    if (!mixes.some((mix) => mix.mixSessionName === mixSessionName))
        throw new Error('Mix Not Found');

    const body = JSON.stringify({
        MixStreamSessionId: mixSessionName,
    });

    const res = await fetch('https://live.tencentcloudapi.com', {
        method: 'POST',
        body,
        headers: getSignedHeaders(
            body,
            {
                secretId: streamInfo.secretId,
                secretKey: streamInfo.secretKey,
            },
            'CancelCommonMixStream'
        ),
    })
        .then((res) => res.json())
        .then((json) => json.Response);

    if (res.Error) {
        throw res.Error;
    } else {
        db.push(
            '/mix',
            mixes.filter((mix) => mix.mixSessionName !== mixSessionName)
        );
    }
};

const mix = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            const newMix = await createMix(req.body);
            res.json(newMix);
        } else if (req.method === 'DELETE') {
            await deleteMix(req.body);
            res.json({ ok: true });
        } else {
            res.status(404).json({ error: 'Wrong Method' });
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(400).json({ error: e.message });
        } else {
            res.status(400).json({ Error: e });
        }
    }
};

export default verify(mix, ['POST', 'DELETE']);
