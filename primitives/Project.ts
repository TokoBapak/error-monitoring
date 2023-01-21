import {UUID} from "~/primitives/UUID";
import {InvalidArgumentError} from "~/errors/InvalidArgumentError";

export class Project {
    constructor(
        public readonly id: UUID,
        public readonly name: string,
        public readonly repositoryUrl: string,
        public readonly createdAt: Date,
        public readonly createdBy: UUID,
    ) {
        if (name === "") throw new InvalidArgumentError("name is empty")
    }

    public toString(): string {
        return JSON.stringify({
            id: this.id.toString(),
            name: this.name.toString(),
            repositoryUrl: this.repositoryUrl,
            createdAt: this.createdAt.toString(),
            createdBy: this.createdBy.toString()
        })
    }

    static fromJSONString(str: string): Project {
        const parsed = JSON.parse(str);
        return new Project(
            new UUID(parsed.id),
            parsed.name,
            parsed.repositoryUrl,
            new Date(parsed.createdAt),
            new UUID(parsed.createdBy)
        )
    }
}