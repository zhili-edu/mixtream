import { Box, Paper, Typography } from '@mui/material';
import type { SxProps } from '@mui/system';
import { useStreams } from '../api/live';
import { displayConfig } from '../config.json';
import { useState } from 'react';
import ColumnCheck from './ColumnCheck';
import CreateMix from './CreateMix';

const MainControl = ({ sx }: { sx?: SxProps }) => {
    const { data } = useStreams();

    const [checked, setChecked] = useState<string[]>([]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                ...sx,
            }}
        >
            <Typography variant="h3">混流</Typography>
            {data ? (
                <Paper
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1.5,
                        width: '100%',
                    }}
                >
                    {Array.from(
                        {
                            length:
                                Math.floor(
                                    (data.names.length - 1) /
                                        displayConfig.groupCount
                                ) + 1,
                        },
                        (_, idx) => (
                            <ColumnCheck
                                key={idx}
                                names={data.names.slice(
                                    idx * displayConfig.groupCount,
                                    (idx + 1) * displayConfig.groupCount
                                )}
                                checked={checked}
                                setChecked={setChecked}
                            />
                        )
                    )}

                    <CreateMix inputs={checked} sx={{ flexGrow: 1 }} />
                </Paper>
            ) : null}
        </Box>
    );
};

export default MainControl;
