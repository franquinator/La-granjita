class Inventory {
    constructor(capacity = 10) {
        this.capacity = capacity;
        this.items = [];
    }

    addItem(item, count = 1) {
        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.count += count;
        } else if (this.items.length < this.capacity) {
            this.items.push({ ...item, count });
        }
        return existing !== undefined || this.items.length <= this.capacity;
    }

    removeItem(itemId, count = 1) {
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

    hasItem(itemId, count = 1) {
        const item = this.items.find(i => i.id === itemId);
        return item && item.count >= count;
    }

    getItemCount(itemId) {
        const item = this.items.find(i => i.id === itemId);
        return item ? item.count : 0;
    }

    getItems() {
        return this.items;
    }

    clear() {
        this.items = [];
    }
}