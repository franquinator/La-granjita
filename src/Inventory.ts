export interface InventoryItem {
    id: string;
    name: string;
    count: number;
}

export class Inventory {
    capacity: number;
    items: InventoryItem[] = [];

    constructor(capacity: number = 10) {
        this.capacity = capacity;
    }

    addItem(item: { id: string; name: string }, count: number = 1): boolean {
        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.count += count;
        } else if (this.items.length < this.capacity) {
            this.items.push({ ...item, count });
        }
        return existing !== undefined || this.items.length <= this.capacity;
    }

    removeItem(itemId: string, count: number = 1): boolean {
        const item = this.items.find(i => i.id === itemId);
        if (item && item.count >= count) {
            item.count -= count;
            if (item.count <= 0) {
                const index = this.items.indexOf(item);
                this.items.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    hasItem(itemId: string, count: number = 1): boolean {
        const item = this.items.find(i => i.id === itemId);
        return item !== undefined && item.count >= count;
    }

    getItemCount(itemId: string): number {
        const item = this.items.find(i => i.id === itemId);
        return item ? item.count : 0;
    }

    getItems(): InventoryItem[] {
        return this.items;
    }

    clear(): void {
        this.items = [];
    }
}