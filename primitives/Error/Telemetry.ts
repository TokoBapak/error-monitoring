import {ErrorLevel} from "~/primitives/ErrorLevel";
import {ErrorType} from "~/primitives/ErrorType";

export type Telemetry = {
    level: ErrorLevel,
    type: ErrorType,
    source: string,
    timestamp: Date,
    body: {
        subtype: string,
        method: string,
        url: string,
        statusCode: string,
        startTimestampMillisecond: number,
        endTimestampMilliseconds: number
    }
}