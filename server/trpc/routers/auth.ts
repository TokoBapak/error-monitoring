import {z} from "zod";
import {publicProcedure, router} from "~/server/trpc/trpc";
import {userService} from "~/application/globals";
import {type Token} from "~/primitives/Token";


/**
 * Auth router handles routes regarding user authentication to TokoBapak's specialized error monitoring system.
 * Clients should use this for
 */
export const authRouter = router({
    /**
     * Exchange the code from GitHub's OAuth authorize endpoint
     * with a bearer token that we can use.
     */
    exchangeAuthToken: publicProcedure
        .input(
            z.object({
                /**
                 * Code is acquired from the URL search parameters callback
                 * from returning to the TokoBapak's site.
                 *
                 * Documentation: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#1-request-a-users-github-identity
                 */
              code: z.string()
            })
        )
        .query((options): Promise<Token> => {
            return userService.login(options.input.code);
        }),
});
