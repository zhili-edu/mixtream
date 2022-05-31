// @ts-ignore
import { TcPlayer } from 'tcplayerlite';
import { useEffect } from 'react';
import { useCredential } from '../api/live';

const StreamPlayer = ({
    appName,
    name,
    id = 'player-id',
}: {
    appName: string;
    name: string;
    id?: string;
}) => {
    const { data } = useCredential();

    useEffect(() => {
        const player = data
            ? new TcPlayer(id, {
                  flash: false,
                  live: true,
                  m3u8: `http://${data.playDomain}/${appName}/${name}.m3u8`,
              })
            : undefined;

        return () => {
            try {
                player?.destroy();
            } catch (e) {
                console.log(e);
            }
        };
    }, [id, data, appName, name]);

    if (data) return <div id={id} style={{ aspectRatio: '16 / 9' }} />;

    return null;
};

export default StreamPlayer;
