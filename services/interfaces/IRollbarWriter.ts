import {UUID} from "~/primitives/UUID";

export interface IRollbarWriter {
    validateAccessToken(token: string): Promise<boolean>;
    writeEvent(event: Event): Promise<UUID>;
}