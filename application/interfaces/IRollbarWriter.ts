import {UUID} from "~/primitives/UUID";
import {ErrorEvent} from "~/primitives/ErrorEvent";

export interface IRollbarWriter {
    writeEvent(token: string, event: ErrorEvent): Promise<UUID>;
}