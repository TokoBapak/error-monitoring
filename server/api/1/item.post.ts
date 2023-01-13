// API reference for this endpoint: https://docs.rollbar.com/reference/create-item

import { z } from "zod";

const bodySchemaBase = z.object({
    telemetry: z.array(z.object({
        level: z.enum(["critical", "error", "warning", "info", "debug"] as const),
        type: z.enum(["log", "network", "dom", "navigation", "error", "manual"] as const),
        source: z.string(),
        timestamp_ms: z.number(),
        body: z.object({
            subtype: z.string(),
            method: z.string(),
            url: z.string(),
            status_code: z.string(),
            start_timestamp_ms: z.number(),
            end_timestamp_ms: z.number(),
            message: z.string().optional(),
        }),
    })).optional(),
})

const requestSchema = z.object({
    data: z.object({
        environment: z.string().min(1, { message: "must not be empty" }),
        body: z.union([
            bodySchemaBase.extend({
                trace: z.object({
                    frames: z.array(z.object({
                        filename: z.string(),
                        lineno: z.number().optional(),
                        colno: z.number().optional(),
                        method: z.string().optional(),
                        code: z.string().optional(),
                        class_name: z.string().optional(),
                        context: z.object({
                            pre: z.array(z.string()).optional(),
                            post: z.array(z.string()),
                        }).optional(),
                        argspec: z.array(z.string()).optional(),
                        varargspec: z.string().optional(),
                        keywordspec: z.string().optional(),
                        locals: z.object({
                            request: z.string(),
                            user: z.string(),
                            args: z.array(z.any()),
                            kwargs: z.record(z.any()),
                        }).optional(),
                    })),
                    exception: z.object({
                        // TODO~
                    })
                })
            }),
            bodySchemaBase.extend({})
        ]),
        level: z.enum(["critical", "error", "warning", "info", "debug"] as const).optional(),
        timestamp: z.number().optional(),
        code_version: z.string().optional(),
        platform: z.string().optional(),
        language: z.string().optional(),
        framework: z.string().optional(),
        context: z.string().optional(),
        request: z.object({
            url: z.string(),
            method: z.string(),
            headers: z.record(z.string()),
            params: z.record(z.string()),
            GET: z.record(z.any()),
            query_string: z.string(),
            post: z.record(z.any()),
            body: z.string(),
            user_ip: z.string(),
        }).optional(),
        person: z.object({
            id: z.string().max(40),
            username: z.string().max(255),
            email: z.string().max(255),
        }).optional(),
        server: z.object({
            cpu: z.string().max(255).optional(),
            host: z.string().optional(),
            root: z.string().optional(),
            branch: z.string().optional(),
            code_version: z.string().optional(),
            sha: z.string().optional()
        }).optional(),
        client: z.object({
            cpu: z.string().max(255).optional(),
            javascript: z.object({
                browser: z.string().optional(),
                code_version: z.string().optional(),
                source_map_enabled: z.boolean().optional(),
                guess_uncaught_frames: z.boolean().optional()
            }).optional()
        }).optional(),
        custom: z.record(z.any()).optional(),
        fingerprint: z.string().optional(),
        title: z.string().max(255).optional(),
        uuid: z.string().max(36).optional(),
        notifier: z.object({
            name: z.string().optional(),
            version: z.string().optional()
        }).optional()
    })
});

export default defineEventHandler(async (event) => {
    const accessToken: string | undefined = getRequestHeader(event, "X-Rollbar-Access-Token");

    const requestBody: any = await readBody(event);
})