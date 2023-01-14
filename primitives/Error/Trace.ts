import {Frames} from "~/primitives/Error/Frames";

export type Trace = {
    frames: Frames[],
    exception: {
        class: string,
        message?: string,
        description?: string
    }
}