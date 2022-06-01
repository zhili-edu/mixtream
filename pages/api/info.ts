import type { NextApiRequest, NextApiResponse } from 'next';
import { streamInfo } from '../../config.json';
import verify from '../../utils/verify';

export interface CredentialInfo {
    pushDomain: string;
    playDomain: string;
    secretId: string;
    secretKey: string;
    appName: string;
}

const info = (req: NextApiRequest, res: NextApiResponse<CredentialInfo>) => {
    res.json({
        pushDomain: streamInfo.pushDomain,
        playDomain: streamInfo.playDomain,
        secretId: streamInfo.secretId,
        secretKey: streamInfo.secretKey,
        appName: streamInfo.appName,
    });
};

export default verify(info, ['GET']);
