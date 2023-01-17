export type Frames = {
    filename: string,
    lineNumber?: number,
    columnNumber?: number,
    method?: string,
    code?: string,
    className?: string,
    context?: {
        pre?: string[],
        post?: never[]
    },
    args?: never[],
}