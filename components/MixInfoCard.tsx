import type { MixInfo } from '../pages/api/mix';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useDeleteMix } from '../api/live';

const MixInfoCard = ({
    mix: { output, inputs, mixSessionName },
}: {
    mix: MixInfo;
}) => {
    const mutation = useDeleteMix();

    return (
        <Paper
            sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, px: 3 }}
        >
            <Typography variant="h6">{output}: </Typography>
            {inputs.map((input) => (
                <Typography key={input}>{input}</Typography>
            ))}

            <Box sx={{ flexGrow: 1 }} />

            <Button
                variant="contained"
                color="error"
                onClick={() => mutation.mutate(mixSessionName)}
            >
                删除混流
            </Button>
        </Paper>
    );
};

export default MixInfoCard;
