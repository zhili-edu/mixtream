import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useStore } from '../pages/_app';
import type { CredentialInfo } from '../pages/api/info';
import type { StreamInfo } from '../pages/api/stream';
import type { MixInfo } from '../pages/api/mix';
import type { CreateMixReq, DeleteMixRes } from '../pages/api/stream/mix';
import type { StateInfo } from '../pages/api/stream/state/[name]';

export const useStreams = () => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);

    return useQuery<StreamInfo, Response>(
        'streams',
        () =>
            fetch('/api/stream', {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                if (Math.floor(res.status / 100) !== 2) throw res;
                return res.json();
            }),
        {
            enabled: token != null,
            staleTime: Infinity,
            onError: (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                }
            },
        }
    );
};

export const useMixes = () => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);

    return useQuery<MixInfo[], Response>(
        'mixes',
        () =>
            fetch('/api/mix', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (Math.floor(res.status / 100) !== 2) throw res;
                    return res.json();
                })
                .then((json) => json.mixes),
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
            }).then((res) => {
                if (Math.floor(res.status / 100) !== 2) throw res;
                return res.json();
            }),
        {
            enabled: token != null,
            staleTime: Infinity,
            onError: async (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                } else {
                    const json = await res.json();
                    if (json.Error) {
                        alert(json.Error.Code + '\n' + json.Error.Message);
                    } else {
                        alert(json.error);
                    }
                }
            },
        }
    );
};

export const useLiveState = (appName: string, streamName: string) => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);

    return useQuery<StateInfo, Response>(
        ['liveState', streamName],
        () => {
            return fetch(`/api/stream/state/${streamName}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                if (Math.floor(res.status / 100) !== 2) throw res;
                return res.json();
            });
        },
        {
            staleTime: 3 * 1000,
            refetchInterval: 3 * 1000,
            refetchIntervalInBackground: true,
            onError: async (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                } else {
                    const json = await res.json();
                    if (json.Error) {
                        alert(json.Error.Code + '\n' + json.Error.Message);
                    } else {
                        alert(json.error);
                    }
                }
            },
        }
    );
};

export const useCreateMix = () => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);
    const queryClient = useQueryClient();

    return useMutation<MixInfo, Response, CreateMixReq>(
        ({ inputs, mixSessionName, output }: CreateMixReq): Promise<MixInfo> =>
            fetch('/api/stream/mix', {
                method: 'POST',
                body: JSON.stringify({
                    inputs,
                    mixSessionName,
                    output,
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }).then((res) => {
                if (Math.floor(res.status / 100) !== 2) throw res;
                return res.json();
            }),
        {
            onSuccess: (mix: MixInfo) => {
                queryClient.setQueryData<MixInfo[]>(
                    'mixes',
                    (mixes) => mixes?.concat(mix) ?? [mix]
                );
            },
            onError: async (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                } else {
                    const json = await res.json();
                    if (json.Error) {
                        alert(json.Error.Code + '\n' + json.Error.Message);
                    } else {
                        alert(json.error);
                    }
                }
            },
        }
    );
};

export const useDeleteMix = () => {
    const token = useStore((state) => state.token);
    const removeToken = useStore((state) => state.removeToken);
    const queryClient = useQueryClient();

    return useMutation<DeleteMixRes, Response, string>(
        (mixSessionName: string) =>
            fetch('/api/stream/mix', {
                method: 'DELETE',
                body: JSON.stringify({
                    mixSessionName,
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }).then((res) => {
                if (Math.floor(res.status / 100) !== 2) throw res;
                return res.json();
            }),
        {
            onSuccess: (res) => {
                queryClient.setQueryData<MixInfo[]>(
                    'mixes',
                    (mixes) =>
                        mixes?.filter(
                            (mix) => mix.mixSessionName !== res.mixSessionName
                        ) ?? []
                );
            },
            onError: async (res: Response) => {
                if (res.status === 403) {
                    removeToken();
                } else {
                    const json = await res.json();
                    if (json.Error) {
                        alert(json.Error.Code + '\n' + json.Error.Message);
                    } else {
                        alert(json.error);
                    }
                }
            },
        }
    );
};
