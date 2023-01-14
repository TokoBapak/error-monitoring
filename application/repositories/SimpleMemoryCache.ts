import {ICache} from "~/application/interfaces/ICache";

export class SimpleMemoryCache implements ICache {
    private readonly _store: Map<string, unknown>;
    private readonly _ttlStore: Map<string, number>;
    private readonly _defaultTimeToLive: number;

    constructor(defaultTtl?: number) {
        if (defaultTtl == undefined || defaultTtl <= 0) {
            this._defaultTimeToLive = -1;
        } else {
            this._defaultTimeToLive = defaultTtl;
        }

        this._store = new Map<string, never>();
        this._ttlStore = new Map<string, number>();

        const clearExpired = () => {
            for (const [key, expiry] of this._ttlStore) {
                if ((Date.now() / 1000) > expiry) {
                    this._ttlStore.delete(key);
                    this._store.delete(key);
                }
            }

            setTimeout(clearExpired, 5_000);
        };

        clearExpired();
    }

    has(key: string): boolean {
        // if default time to live is set to -1, we can directly
        // check to the main store.
        if (this._defaultTimeToLive === -1) {
            return this._store.has(key);
        }

        // this means default time to live is greater than zero
        if (this._ttlStore.has(key)) {
            // check if it's expired
            const expirySecond = this._ttlStore.get(key);
            if (expirySecond === undefined) {
                return false;
            }

            // check if now is greater than ttl
            const hasExpired = (Date.now() / 1000) > expirySecond;

            if (hasExpired) {
                // while we're here, we can delete the key
                this._store.delete(key);
                this._ttlStore.delete(key);
                return false;
            }

            return true;
        }

        return false;
    }

    get<T>(key: string): T | undefined {
        if (!this.has(key)) {
            return undefined;
        }

        // the TTL is checked by the has() function before
        return this._store.get(key) as T | undefined;
    }

    set<T>(key: string, value: T, ttl?: number) {
        // set this one out first
        this._store.set(key, value);

        // if ttl is provided, we use it.
        if (ttl !== undefined) {
            this._ttlStore.set(key, (Date.now() / 1000) + ttl);
            return;
        }

        // ttl is undefined here, we should check the default ttl
        if (this._defaultTimeToLive > 0) {
            this._ttlStore.set(key, (Date.now() / 1000) + this._defaultTimeToLive);
        }
    }
}