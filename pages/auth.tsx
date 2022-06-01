import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation } from 'react-query';
import { useStore } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/router';

const AuthPage = () => {
    const setToken = useStore((state) => state.setToken);
    const removeToken = useStore((state) => state.removeToken);

    const router = useRouter();
    const mutation = useMutation(
        (pass: string) => {
            return fetch('/api/auth', { method: 'POST', body: pass });
        },
        {
            onSuccess: async (res: Response) => {
                setToken(await res.text());
                router.push('/');
            },
            onError: (res: Response) => {
                removeToken();
            },
        }
    );

    const [pass, setPass] = useState<string>('');

    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                gap: 2,
            }}
        >
            <Box sx={{ flexGrow: 1 }} />
            <Typography
                sx={{
                    fontSize: 120,
                    fontWeight: 'bold',
                    background:
                        '-webkit-linear-gradient(60deg, #E21143, #FFB03A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                天王盖地虎？
            </Typography>
            <TextField value={pass} onChange={(e) => setPass(e.target.value)} />
            <Button
                color="info"
                variant="contained"
                onClick={() => {
                    mutation.mutate(pass);
                }}
                sx={{
                    mt: 2,
                    fontSize: 18,
                    width: '8%',
                    height: '5%',
                }}
            >
                yes
            </Button>
            <Box sx={{ flexGrow: 1.5 }} />
        </Box>
    );
};

export default AuthPage;
