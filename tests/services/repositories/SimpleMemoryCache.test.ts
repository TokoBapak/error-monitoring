import {describe, it, expect} from "vitest";
import {SimpleMemoryCache} from "~/application/repositories/SimpleMemoryCache.ts";


describe("SimpleMemoryCache", () => {
    it("should be able to create an instance without any default ttl", () => {
        const simpleMemoryCache = new SimpleMemoryCache();

        simpleMemoryCache.set("hello", "world");

        expect(simpleMemoryCache.has("hello")).toStrictEqual(true);

        const hello = simpleMemoryCache.get<string>("hello");

        expect(hello).toBeDefined();
        expect(typeof hello).toStrictEqual("string");
        expect(hello).toStrictEqual("world");

        const notFound = simpleMemoryCache.get<string>("notfound");

        expect(notFound).toBeUndefined();
    });

    it("should be able to create an instance with default ttl", () => {
        const simpleMemoryCache = new SimpleMemoryCache(1);

        simpleMemoryCache.set("hello", "world");
        const helloQuick = simpleMemoryCache.get<string>("hello");

        expect(simpleMemoryCache.has("hello")).toStrictEqual(true);

        expect(helloQuick).toBeDefined();
        expect(helloQuick).toStrictEqual("world");

        setTimeout(() => {
            const hello = simpleMemoryCache.get<string>("hello");

            console.log("this is executed");
            expect(hello).toBeUndefined();
        }, 2000);

        const notFound = simpleMemoryCache.get<string>("notfound");

        expect(notFound).toBeUndefined();
    });
});