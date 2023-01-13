import { randomUUID } from "crypto";

export class InvalidUuidError extends Error {
    constructor(m?: string) {
        super(m || "invalid UUID");

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidUuidError.prototype);
    }
}

export class UUID {
    protected m_str: string;

    constructor(str?: string) {
        if (str === undefined) {
            this.m_str = this.newUuid();
        } else {
            this.m_str = str;
        }

        const reg = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
        if (!reg.test(this.m_str)) throw new InvalidUuidError();
    }

    toString() {
        return this.m_str;
    }

    private newUuid(): string {
        return randomUUID();
    }
}