import { Box, SxProps, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const StreamPlayer = dynamic(() => import('./StreamPlayer'), { ssr: false });

const StreamContent = ({ name, sx }: { name: string; sx?: SxProps }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                gap: 1.5,
                ...sx,
            }}
        >
            <Typography variant="h3">{name}</Typography>

            <StreamPlayer name={name} />
        </Box>
    );
};

export default StreamContent;
