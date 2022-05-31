import { getSignedHeaders } from './utils';
import { useQuery } from 'react-query';
import { useStore } from '../pages/_app';
import type { CredentialInfo } from '../pages/api/info';
import type { StreamInfo } from '../pages/api/stream';

export const useStreams = () => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);

    return useQuery<StreamInfo, Response>(
        'streams',
        () =>
            fetch('/api/stream', {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json()),
        {
            enabled: token != null,
            onError: (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                }
            },
        }
    );
};

export const useCredential = () => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);

    return useQuery<CredentialInfo, Response>(
        'credential',
        () =>
            fetch('/api/info', {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json()),
        {
            enabled: token != null,
            onError: (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                }
            },
        }
    );
};

/*export const useLiveState = (appName: string, streamName: string) => {
    const { data } = useCredential();

    return useQuery(
        ['liveState', streamName],
        () => {
            return fetch('https://live.tencentcloudapi.com', {
                headers: getSignedHeaders(
                    JSON.stringify({
                        AppName: appName,
                        StreamName: streamName,
                        DomainName: data!.pushDomain,
                    }),
                    data!,
                    'DescribeLiveStreamState'
                ),
                mode: 'no-cors',
            }).then((res) => {
                console.log(res);
                console.log(res.body);
                return res;
            });
        },
        {
            enabled: data != null,
        }
    );
};*/

export const useLiveState = (appName: string, streamName: string) => {
    return useQuery<{
        RequestId: string;
        StreamState: 'active' | 'inactive' | 'forbid';
    }>(
        ['liveState', streamName],
        () => {
            return fetch(`/api/stream/state/${streamName}`).then((res) =>
                res.json()
            );
        },
        {
            staleTime: 3 * 1000,
            refetchInterval: 3 * 1000,
            refetchIntervalInBackground: true,
        }
    );
};

export const getLiveState = (
    {
        appName: AppName,
        name: StreamName,
        pushDomain: DomainName,
    }: {
        appName: string;
        name: string;
        pushDomain: string;
    },
    cretentials: { secretId: string; secretKey: string }
): Promise<Response> => {
    const body = {
        AppName,
        StreamName,
        DomainName,
    };

    return fetch('/live.tencentcloudapi.com', {
        headers: getSignedHeaders(
            JSON.stringify(body),
            cretentials,
            'DescribeLiveStreamState'
        ),
    });
};
