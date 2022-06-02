import type { NextPage } from 'next';
import { useStore } from './_app';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import StreamContent from '../components/StreamContent';
import MainControl from '../components/MainControl';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Home: NextPage = () => {
    const token = useStore((state) => state.token);
    const router = useRouter();

    useEffect(() => {
        if (!token) router.push('/auth');
    }, [token, router]);

    const [stream, setStream] = useState<string | null>(null);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Header />

            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <Sidebar stream={stream} setStream={setStream} />

                {stream ? (
                    <StreamContent name={stream} sx={{ flexGrow: 1 }} />
                ) : (
                    <MainControl sx={{ flexGrow: 1 }} />
                )}
            </Box>
        </Box>
    );
};

export default Home;
