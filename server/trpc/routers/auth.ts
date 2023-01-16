import {z} from "zod";
import {publicProcedure, router} from "~/server/trpc/trpc";

export const authRouter = router({
    exchangeAuthToken: publicProcedure
        .input(
            z.object({
              code: z.string()
            })
        )
        .query((x) => {
            x.ctx
            return {
                message: "Hello world"
            }
        })
});