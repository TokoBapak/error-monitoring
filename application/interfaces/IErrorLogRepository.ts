import {ErrorEvent} from "~/primitives/ErrorEvent";
import {UUID} from "~/primitives/UUID";

export interface IErrorLogRepository {
    migrate(): Promise<void>;
    create(projectId: UUID, event: ErrorEvent): Promise<void>;

}