import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient();

export const useStore = create(
    persist<{
        token: string | undefined;
        setToken: (token: string) => void;
        removeToken: () => void;

        appName: string;
        pushDomain: string;

        mixNames: string[];
    }>(
        (set) => ({
            token: undefined,
            setToken: (token: string) => set({ token }),
            removeToken: () => set({ token: undefined }),

            appName: '',
            pushDomain: '',

            mixNames: [],
        }),
        { name: 'main-store', getStorage: () => sessionStorage }
    )
);

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <CssBaseline />
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;
