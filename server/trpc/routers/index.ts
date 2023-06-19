import { publicProcedure, router } from '../trpc';
import {authRouter} from "~/server/trpc/routers/auth";

export const appRouter = router({
    auth: authRouter
});

export type AppRouter = typeof appRouter;