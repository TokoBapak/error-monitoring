import {IRollbarWriter} from "~/application/interfaces/IRollbarWriter";
import {IAuthentication} from "~/application/interfaces/IAuthentication";
import {IErrorLogRepository} from "~/application/interfaces/IErrorLogRepository";
import {IProjectRepository} from "~/application/interfaces/IProjectRepository";
import {UUID} from "~/primitives/UUID";
import {ErrorEvent} from "~/primitives/ErrorEvent";
import {InvalidProject} from "~/errors/InvalidProject";

export class RollbarWriter implements IRollbarWriter {
    constructor(
        private readonly authentication: IAuthentication,
        private readonly errorLogRepository: IErrorLogRepository,
        private readonly projectRepository: IProjectRepository
    ) {}

    async writeEvent(token: string, event: ErrorEvent): Promise<UUID> {
        // Validate token, acquire project ID from the token.
        const projectId = await this.authentication.validateProjectToken(token);

        // Check if project ID exists.
        const exists = await this.projectRepository.exists(projectId.id);

        if (!exists) throw new InvalidProject("invalid project: " + projectId.id.toString());

        // Write to database
        await this.errorLogRepository.create(projectId.id, event);

        return event.uuid;
    }
}
