import { Box, Paper, Typography } from '@mui/material';
import type { SxProps } from '@mui/system';
import { useMixes, useStreams } from '../api/live';
import { displayConfig } from '../config.json';
import { useState } from 'react';
import ColumnCheck from './ColumnCheck';
import CreateMix from './CreateMix';
import MixInfoCard from './MixInfoCard';

const MainControl = ({ sx }: { sx?: SxProps }) => {
    const { data: streams } = useStreams();
    const { data: mixes } = useMixes();

    const [checked, setChecked] = useState<string[]>([]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                ...sx,
            }}
        >
            <Typography variant="h3">混流</Typography>
            {streams ? (
                <Paper
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 1.5,
                        width: '100%',
                    }}
                >
                    {Array.from(
                        {
                            length:
                                Math.floor(
                                    (streams.names.length - 1) /
                                        displayConfig.groupCount
                                ) + 1,
                        },
                        (_, idx) => (
                            <ColumnCheck
                                key={idx}
                                names={streams.names.slice(
                                    idx * displayConfig.groupCount,
                                    (idx + 1) * displayConfig.groupCount
                                )}
                                checked={checked}
                                setChecked={setChecked}
                            />
                        )
                    )}

                    <CreateMix
                        inputs={checked}
                        sx={{ flexGrow: 1, alignSelf: 'center' }}
                    />
                </Paper>
            ) : null}

            {mixes ? (
                <Paper
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                    }}
                >
                    <Typography variant="h5">已混流：</Typography>
                    {mixes.map((mix) => (
                        <MixInfoCard key={mix.mixSessionName} mix={mix} />
                    ))}
                </Paper>
            ) : null}
        </Box>
    );
};

export default MainControl;
