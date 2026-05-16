import { isServer, QueryClient } from '@tanstack/react-query';

function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (isServer) {
        return createQueryClient();
    }

    if (!browserQueryClient) {
        browserQueryClient = createQueryClient();
    }

    return browserQueryClient;
}
