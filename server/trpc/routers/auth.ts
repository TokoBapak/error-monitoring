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
            // TODO: call the user service for registration
            return {
                message: "Hello world"
            }
        })
});