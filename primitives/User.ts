import { InvalidArgumentError } from "~~/errors/InvalidArgumentError";

export class User {
    constructor(
        public readonly id: number,
        public readonly nodeId: string,
        public readonly username: string,
        public readonly name: string,
        public readonly avatarUrl: string,
        public readonly profileUrl: string,
    ) {
        if (username === "") throw new InvalidArgumentError("username is empty");
    }

    public toString(): string {
        return JSON.stringify({
            id: this.id,
            nodeId: this.nodeId,
            username: this.username,
            name: this.name,
            avatarUrl: this.avatarUrl,
            profileUrl: this.profileUrl,
        });
    }

    static fromJSONString(str: string): User {
        const parsed = JSON.parse(str);

        return new User(
            parsed.id, 
            parsed.nodeId, 
            parsed.username, 
            parsed.name,
            parsed.avatarUrl, 
            parsed.profileUrl,
        );
    }
}