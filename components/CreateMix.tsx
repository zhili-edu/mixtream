import { Box, Button, TextField } from '@mui/material';
import type { SxProps } from '@mui/system';
import { useState } from 'react';
import { useCreateMix } from '../api/live';

const CreateMix = ({ inputs, sx }: { inputs: string[]; sx?: SxProps }) => {
    const [output, setOutput] = useState<string>('');
    const [session, setSession] = useState<string>('');
    const mutation = useCreateMix();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                px: 1,
                ...sx,
            }}
        >
            <TextField
                label="输出流名称"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
            />

            <TextField
                label="混流Session名称"
                placeholder="唯一Session ID，不可重复"
                value={session}
                onChange={(e) => setSession(e.target.value)}
            />

            <Button
                variant="contained"
                disabled={inputs.length > 12}
                onClick={() =>
                    mutation.mutate({
                        inputs,
                        mixSessionName: session,
                        output,
                    })
                }
            >
                {inputs.length <= 12 ? '创建混流' : '输入流过多'}
            </Button>
        </Box>
    );
};

export default CreateMix;
