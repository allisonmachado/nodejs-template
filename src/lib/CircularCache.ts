import { CheckTypes } from "./CheckTypes";

export class CircularCache<T> {
    private currentIndex: number;
    private readonly keyToIndex: Map<string, number>;
    private readonly indexToKey: Map<number, string>;
    private readonly data: T[];

    constructor(private readonly size: number) {
        if (!this.size) {
            throw new Error(`[${CircularCache.name}]: a size parameter is mandatory`)
        }
        if (this.size > 10) {
            throw new Error(`[${CircularCache.name}]: this cache is supposed to be small, biggest size is 10`)
        }
        this.currentIndex = 0;
        this.keyToIndex = new Map();
        this.indexToKey = new Map();
        this.data = [];
    }

    public search(key: string): T {
        const dataIndex = this.keyToIndex.get(key);
        if (!CheckTypes.hasContent(dataIndex)) {
            return null;
        }
        return this.data[dataIndex];
    }

    public cache(key: string, data: T): void {
        // To avoid keyToIndex map grow big we delete the key related to index that will be cached:
        const currentKey = this.indexToKey.get(this.currentIndex);
        if (CheckTypes.hasContent(currentKey)) {
            this.keyToIndex.delete(currentKey);
        }

        // To find data quickly we need a map to the index:
        this.keyToIndex.set(key, this.currentIndex);

        // Keep track of key related to index later to avoid keyToIndex map grow big:
        this.indexToKey.set(this.currentIndex, key);

        // Cache core:
        this.data[this.currentIndex] = data;

        // Circular overwrite data:
        this.currentIndex = (this.currentIndex + 1) % this.size;
    }
}