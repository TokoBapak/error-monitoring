import { httpBatchLink, createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from '@/server/trpc/routers';

export default defineNuxtPlugin((_nuxtApp) => {
    const client = createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                // TODO: change this url to a more configurable one
                url: 'http://localhost:3000/api/trpc'
            })
        ]
    });

    return {
        provide: {
            client
        }
    };
});