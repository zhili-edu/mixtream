import type { NextApiRequest, NextApiResponse } from 'next';
import { getSignedHeaders } from '../../../../api/utils';
import { streamInfo } from '../../../../config.json';

const state = async (req: NextApiRequest, res: NextApiResponse<string>) => {
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
    }).then((res) => res.json());

    res.json(json.Response);
};

export default state;
