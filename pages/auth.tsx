import { Box, Button, TextField } from '@mui/material';
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
        <Box>
            <TextField value={pass} onChange={(e) => setPass(e.target.value)} />
            <Button
                onClick={() => {
                    mutation.mutate(pass);
                }}
            >
                yes
            </Button>
        </Box>
    );
};

export default AuthPage;
