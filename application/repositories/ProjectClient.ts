import { Pool } from "pg";
import {IProjectRepository} from "~/application/interfaces/IProjectRepository";
import {UUID} from "~/primitives/UUID";
import {Project} from "~/primitives/Project";
import {NotFoundError} from "~/errors/NotFoundError";

export class ProjectClient implements IProjectRepository {
    constructor(private readonly client: Pool) {
    }

    async create(project: Project): Promise<UUID> {
        const conn = await this.client.connect();

        try {
            await conn.query("BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED");

            await conn.query(`INSERT INTO
                project
                (
                    id,
                    name,
                    repository_url,
                    created_at,
                    created_by,
                    updated_at,
                    updated_by
                )`,
                [
                    project.id.toString(),
                    project.name,
                    project.repositoryUrl,
                    project.createdAt,
                    project.createdBy.toString(),
                    project.createdAt,
                    project.createdBy.toString()
                ],
            );

            await conn.query("COMMIT")

            return project.id;
        } catch (error: unknown) {
            await conn.query("ROLLBACK")

            throw error;
        } finally {
            conn.release();
        }
    }

    async exists(id: UUID): Promise<boolean> {
        const conn = await this.client.connect();

        try {
            const queryResult = await conn.query(`SELECT EXISTS(SELECT * FROM project WHERE id = ?) AS exists`,[id.toString()]);

            return queryResult.rows[0].exists;

        } catch (error: unknown) {
            throw error;
        } finally {
            conn.release();
        }
    }

    async getById(id: UUID): Promise<Project> {
        const conn = await this.client.connect();

        try {
            const queryResult = await conn.query(`SELECT 
                id, 
                name, 
                repository_url, 
                created_at, 
                created_by
            FROM
                project
            WHERE
                id = $1
            LIMIT 1`,
                [id.toString()],
            );

            if (queryResult.rowCount === 0) {
                throw new NotFoundError(`Getting project by ${id.toString()}`)
            }

            if (queryResult.rows.length === 0) {
                throw new NotFoundError(`Getting project by ${id.toString()}`)
            }

            if (queryResult.rows[0] === undefined) {
                throw new NotFoundError(`Getting project by ${id.toString()}`)
            }


            const row = queryResult.rows[0];
            let createdAt: Date;
            if (row.created_at !== undefined) {
                if (typeof row.created_at === "string") {
                    createdAt = new Date(row.created_at);
                } else if (row.created_at instanceof Date) {
                    createdAt = row.created_at;
                } else {
                    createdAt = new Date(0);
                }
            }

            const project = new Project(
                new UUID(row.id),
                row.name,
                row.repository_url,
                createdAt,
                new UUID(row.created_by)
            );

            return project;
        } catch (error: unknown) {
            throw error;
        } finally {
            conn.release();
        }
    }

    async listAll(): Promise<Project[]> {
        const conn = await this.client.connect();

        try {
            const queryResult = await conn.query(`SELECT 
                id, 
                name, 
                repository_url, 
                created_at, 
                created_by
            FROM
                project`);

            if (queryResult.rowCount === 0) {
                return [] as Project[];
            }

            const projects: Project[] = [];

            for (const row of queryResult.rows) {
                if (row === undefined) continue;

                let createdAt: Date;
                if (row.created_at !== undefined) {
                    if (typeof row.created_at === "string") {
                        createdAt = new Date(row.created_at);
                    } else if (row.created_at instanceof Date) {
                        createdAt = row.created_at;
                    } else {
                        createdAt = new Date(0);
                    }
                }

                const project = new Project(
                    new UUID(row.id),
                    row.name,
                    row.repository_url,
                    createdAt,
                    new UUID(row.created_by)
                );

                projects.push(project);
            }

            return projects;
        } catch (error: unknown) {
            throw error;
        } finally {
            conn.release();
        }
    }

    async migrate(): Promise<void> {
        const conn = await this.client.connect();

        try {
            await conn.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;");

            await conn.query(`CREATE TABLE IF NOT EXISTS project (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                repository_url TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                created_by UUID NOT NULL,
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_by UUID NOT NULL
            )`);

            await conn.query("COMMIT;");
        } catch (error: unknown) {
            await conn.query("ROLLBACK;");

            throw error;
        } finally {
            conn.release();
        }
    }
}