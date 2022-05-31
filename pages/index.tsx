import type { NextPage } from 'next';
import { useStore } from './_app';
import { useRouter } from 'next/router';
import { Box, Drawer, List } from '@mui/material';
import { useEffect, useState } from 'react';
import StreamContent from '../components/StreamContent';
import StreamListItem from '../components/StreamListItem';
import { useStreams } from '../api/live';
import MainControl from '../components/MainControl';

const Home: NextPage = () => {
    const token = useStore((state) => state.token);
    const router = useRouter();

    const { data } = useStreams();

    useEffect(() => {
        if (!token) router.push('/auth');
    }, [token, router]);

    const [stream, setStream] = useState<string | null>(null);

    const drawerWidth = 250;
    if (data)
        return (
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                >
                    <List disablePadding>
                        {data.names.map((name) => (
                            <StreamListItem
                                key={name}
                                name={name}
                                selected={name === stream}
                                onClick={(_e) =>
                                    setStream(stream === name ? null : name)
                                }
                            />
                        ))}
                    </List>
                </Drawer>

                {stream ? (
                    <StreamContent
                        appName={data.appName}
                        name={stream}
                        sx={{ flexGrow: 1 }}
                    />
                ) : (
                    <MainControl />
                )}
            </Box>
        );

    return null;
};

export default Home;
