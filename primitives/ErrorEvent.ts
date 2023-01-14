import {UUID} from "~/primitives/UUID";
import {ErrorLevel} from "~/primitives/ErrorLevel";
import {Telemetry} from "~/primitives/Error/Telemetry";
import {Trace} from "~/primitives/Error/Trace";

export type ErrorEvent = {
    // A string, up to 36 characters, that uniquely identifies this occurrence.
    // While it can now be any latin1 string, this may change to be a 16 byte field in the future.
    // We recommend using a UUID4 (16 random bytes).
    // The UUID space is unique to each project, and can be used to look up an occurrence later.
    // It is also used to detect duplicate requests. If you send the same UUID in two payloads, the second
    // one will be discarded.
    // While optional, it is recommended that all clients generate and provide this field
    uuid: UUID,

    // The name of the environment in which this occurrence was seen.
    // A string up to 255 characters. For best results, use "production" or "prod" for your
    // production environment.
    environment: string,

    // The severity level. One of: "critical", "error", "warning", "info", "debug"
    // Defaults to "error" for exceptions and "info" for messages.
    // The level of the *first* occurrence of an item is used as the item's level.
    level: ErrorLevel,

    // When this occurred
    timestamp: Date,

    // The platform on which this occurred. Meaningful platform names:
    // "browser", "android", "ios", "flash", "client", "heroku", "google-app-engine"
    // If this is a client-side event, be sure to specify the platform and use a post_client_item access token.
    platform: string,

    // The name of the language your code is written in.
    // This can affect the order of the frames in the stack trace. The following languages set the most
    // recent call first - 'ruby', 'javascript', 'php', 'java', 'objective-c', 'lua'
    // It will also change the way the individual frames are displayed, with what is most consistent with
    // users of the language.
    language: string,

    // The name of the framework your code uses
    framework: string,

    // A string that will be used as the title of the Item occurrences will be grouped into.
    // Max length 255 characters.
    // If omitted, we'll determine this on the backend.
    title: string,
    payload: {
        body: {
            telemetry?: Telemetry[],
            trace?: Trace,
            traceChain?: Trace[],
            message?: {
                body: string,
                [key: string]: never
            },
            crashReport?: {
                raw: string
            }
        },
        codeVersion?: string,
        context?: string,
        request?: {
            url: string,
            method: string,
            headers: Record<string, string>,
            params: Record<string, string>,
            queryString: string,
            rawBody: string,
            userIP: string,
        },
        person?: {
            id: string,
            username?: string,
            email?: string
        },
        server?: {
            cpu?: string,
            host?: string,
            root?: string,
            branch?: string,
            codeVersion?: string,
        },
        client?: {
            cpu?: string,
            javascript?: {
                browser?: string,
                codeVersion?: string,
                sourceMapEnabled?: boolean,
                guessUncaughtFrames?: boolean
            }
        },
        custom?: Record<string, never>,
        fingerprint?: string,
        notifier?: {
            name?: string,
            version?: string
        }
    }
}