import * as crypto from 'crypto';
import type { BinaryLike, BinaryToTextEncoding } from 'crypto';

const sha256 = (
    message: string | BinaryLike,
    secret: BinaryLike,
    encoding?: BinaryToTextEncoding
) => {
    const hmac = crypto.createHmac('sha256', secret).update(message);

    if (encoding) {
        return hmac.digest(encoding);
    } else {
        return hmac.digest();
    }
};

const getHash = (message: string, encoding: BinaryToTextEncoding = 'hex') =>
    crypto.createHash('sha256').update(message).digest(encoding);

const getDate = (timeStamp: number) => {
    const date = new Date(timeStamp * 1000);

    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);

    return `${year}-${month}-${day}`;
};

export const getSignedHeaders = (
    payload: string,
    credentials: { secretId: string; secretKey: string },
    action: string
): Record<string, string> => {
    const timeStamp = Math.floor(Date.now() / 1000);
    const date = getDate(timeStamp);

    const canonicalRequest =
        'POST\n/\n\ncontent-type:application/json; charset=utf-8\nhost:live.tencentcloudapi.com\n\ncontent-type;host\n' +
        getHash(payload);

    // get signed string
    const credentialScope = date + '/live/tc3_request';
    const stringToSign =
        'TC3-HMAC-SHA256\n' +
        timeStamp +
        '\n' +
        credentialScope +
        '\n' +
        getHash(canonicalRequest);

    // calculate sign
    const kDate = sha256(date, 'TC3' + credentials.secretKey);
    const kService = sha256('live', kDate);
    const kSigning = sha256('tc3_request', kService);
    const signature = sha256(stringToSign, kSigning, 'hex');

    // get authorization
    const authorization =
        'TC3-HMAC-SHA256 Credential=' +
        credentials.secretId +
        '/' +
        credentialScope +
        ', SignedHeaders=content-type;host' +
        ', Signature=' +
        signature;

    return {
        Authorization: authorization,
        'Content-Type': 'application/json; charset=utf-8',
        Host: 'live.tencentcloudapi.com',
        'X-TC-Action': action,
        'X-TC-Timestamp': timeStamp.toString(),
        'X-TC-Version': '2018-08-01',
    };
};
