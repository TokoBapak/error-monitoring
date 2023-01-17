export enum ErrorLevel {
    CRITICAL = "critical",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    DEBUG = "debug"
}

export function convertToErrorLevel(s: string): ErrorLevel {
    switch (s.toLowerCase()) {
        case "critical":
            return ErrorLevel.CRITICAL;
        case "error":
        case "err":
            return ErrorLevel.ERROR;
        case "warning":
        case "warn":
            return ErrorLevel.WARNING;
        case "info":
            return ErrorLevel.INFO;
        case "debug":
            return ErrorLevel.DEBUG;
        default:
            return ErrorLevel.INFO;
    }
}