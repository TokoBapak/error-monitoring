import {uuidv7, uuidv4} from "uuidv7";

export class InvalidUuidError extends Error {
    constructor(m?: string) {
        super(m || "invalid UUID");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidUuidError.prototype);
    }
}

export class UUID {
    protected m_str: string;
    public readonly version: 4 | 7;

    constructor(str?: string) {
        if (str === undefined) {
            this.m_str = this.newUuid();
            this.version = 7;
        } else {
            this.m_str = str;
            this.version = 4;
        }

        const v4reg = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
        if (!v4reg.test(this.m_str)) {
            // Try for v7
            const v7reg = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-7[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
            if (!v7reg.test(this.m_str)) throw new InvalidUuidError();

            this.version = 7;
        }
    }

    toString() {
        return this.m_str;
    }

    private newUuid(): string {
        return uuidv7();
    }
}