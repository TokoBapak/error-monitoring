import {UUID} from "~/primitives/UUID";

export interface IRollbarWriter {
    writeEvent(event: Event): Promise<UUID>;
}