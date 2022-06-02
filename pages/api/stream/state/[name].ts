import type { NextApiRequest, NextApiResponse } from 'next';
import { getSignedHeaders } from '../../../../api/utils';
import { streamInfo } from '../../../../config.json';
import verify from '../../../../utils/verify';

export interface StateInfo {
    state: 'active' | 'inactive' | 'forbid';
}

const state = async (req: NextApiRequest, res: NextApiResponse) => {
    const name = req.query.name;
    const body = JSON.stringify({
        AppName: streamInfo.appName,
        StreamName: name,
        DomainName: streamInfo.pushDomain,
    });

    const json = await fetch('https://live.tencentcloudapi.com', {
        method: 'POST',
        body,
        headers: getSignedHeaders(
            body,
            { secretId: streamInfo.secretId, secretKey: streamInfo.secretKey },
            'DescribeLiveStreamState'
        ),
    })
        .then((res) => res.json())
        .then((json) => json.Response);

    if (json.Error) {
        res.status(400).json({ Error: json.Error });
    } else {
        res.status(200).json({ state: json.StreamState });
    }
};

export default verify(state, ['GET']);
