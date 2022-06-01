import type { NextPage } from 'next';
import { useStore } from './_app';
import { useRouter } from 'next/router';
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
} from '@mui/material';
import { useEffect, useState } from 'react';
import StreamContent from '../components/StreamContent';
import StreamListItem from '../components/StreamListItem';
import { useMixes, useStreams } from '../api/live';
import MainControl from '../components/MainControl';

const Home: NextPage = () => {
    const token = useStore((state) => state.token);
    const router = useRouter();

    const { data: streams } = useStreams();
    const { data: mixes } = useMixes();

    useEffect(() => {
        if (!token) router.push('/auth');
    }, [token, router]);

    const [stream, setStream] = useState<string | null>(null);

    const drawerWidth = 250;
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
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setStream(null)}>
                            <ListItemText
                                primary="Mixtream"
                                primaryTypographyProps={{ variant: 'h4' }}
                                secondary="首页"
                            />
                        </ListItemButton>
                    </ListItem>
                    <Divider />

                    <ListSubheader>混流</ListSubheader>
                    {mixes?.map((mix) => (
                        <StreamListItem
                            key={mix.output}
                            name={mix.output}
                            selected={mix.output === mix.output}
                            onClick={(_e) =>
                                setStream(
                                    mix.output === stream ? null : mix.output
                                )
                            }
                        />
                    )) ?? null}
                    <ListSubheader>输入流</ListSubheader>
                    {streams?.names.map((name) => (
                        <StreamListItem
                            key={name}
                            name={name}
                            selected={name === stream}
                            onClick={(_e) =>
                                setStream(stream === name ? null : name)
                            }
                        />
                    )) ?? null}
                </List>
            </Drawer>

            {stream ? (
                <StreamContent name={stream} sx={{ flexGrow: 1 }} />
            ) : (
                <MainControl sx={{ flexGrow: 1 }} />
            )}
        </Box>
    );
};

export default Home;
