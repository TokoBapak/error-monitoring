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
}