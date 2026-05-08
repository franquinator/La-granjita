import * as PIXI from 'pixi.js';

/**
 * Clase base para cualquier item del inventario.
 * Puede ser una semilla, cosechas, o cualquier otro objeto.
 */
export class InventoryItem {
    id: string;
    name: string;
    count: number;
    
    // Color para mostrar en el inventario (cuando no hay sprite)
    color: number = 0xFFFFFF;
    
    constructor(id: string, name: string, count: number = 1, color: number = 0xFFFFFF) {
        this.id = id;
        this.name = name;
        this.count = count;
        this.color = color;
    }
    
    /** Incrementa la cantidad */
    add(count: number): void {
        this.count += count;
    }
    
    /** Decrementa la cantidad, retorna si aún tiene items */
    remove(count: number): boolean {
        this.count -= count;
        return this.count > 0;
    }
}

/**
 * Representa una herramienta del juego.
 * Tiene sprite y puede usarse en el gameplay.
 */
export class InventoryTool extends InventoryItem {
    // Texture para mostrar en la UI
    texture: PIXI.Texture | null = null;
    
    constructor(id: string, name: string, texture: PIXI.Texture | null = null) {
        super(id, name, 1, 0xFFFFFF);
        this.texture = texture;
    }
}

/**
 * Colores por defecto para items del inventario
 */
export const ITEM_COLORS: Record<string, number> = {
    'Trigo': 0xF4D03F,
    'Maíz': 0xF39C12,
    'Tomate': 0xE74C3C,
    'Frutilla': 0xFF6B6B,
    'huevo': 0xFFFF00,
    'leche': 0xFFFFFF
};

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
            const color = ITEM_COLORS[item.name] || 0xFFFFFF;
            this.items.push(new InventoryItem(item.id, item.name, count, color));
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