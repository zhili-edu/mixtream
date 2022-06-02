import { Box, Checkbox, Paper, Typography } from '@mui/material';
import type { SxProps } from '@mui/system';

const ColumnCheck = ({
    names,
    checked,
    setChecked,
    sx,
}: {
    names: string[];
    checked: string[];
    setChecked: (arg0: string[]) => void;
    sx?: SxProps;
}) => {
    return (
        <Paper
            key={names[0]}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                px: 3,
                ...sx,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Checkbox
                    checked={names.every((n) => checked.includes(n))}
                    indeterminate={
                        names.some((n) => checked.includes(n)) &&
                        names.some((n) => !checked.includes(n))
                    }
                    onChange={(e) => {
                        if (e.target.checked) {
                            setChecked(
                                names.reduce(
                                    (c, n) => (c.includes(n) ? c : [...c, n]),
                                    checked
                                )
                            );
                        } else {
                            setChecked(
                                names.reduce(
                                    (c, n) =>
                                        c.includes(n)
                                            ? c.filter((i) => i !== n)
                                            : c,
                                    checked
                                )
                            );
                        }
                    }}
                    sx={{ p: 0 }}
                />
                <Typography>全选</Typography>
            </Box>
            {names.map((name) => (
                <Box
                    key={name}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        pl: 1,
                    }}
                >
                    <Checkbox
                        checked={checked.includes(name)}
                        onChange={(_) =>
                            setChecked(
                                checked.includes(name)
                                    ? checked.filter((i) => i !== name)
                                    : [...checked, name]
                            )
                        }
                        sx={{ p: 0 }}
                    />
                    <Typography>{name}</Typography>
                </Box>
            ))}
        </Paper>
    );
};

export default ColumnCheck;
