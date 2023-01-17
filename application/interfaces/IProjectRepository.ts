import {UUID} from "~/primitives/UUID";
import {Project} from "~/primitives/Project";

export interface IProjectRepository {
    migrate(): Promise<void>;

    create(project: Project): Promise<UUID>;
    listAll(): Promise<Project[]>;
    getById(id: UUID): Promise<Project>;
    exists(id: UUID): Promise<boolean>;
}