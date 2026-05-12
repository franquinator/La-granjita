import * as PIXI from 'pixi.js';
import { Item } from './Item.js';
import { game } from './Game.js';

export class DroppedItem {
    item: Item;
    sprite: PIXI.Sprite | null = null;
    x: number = 0;
    y: number = 0;
    private inGrilla: boolean = false;

    constructor(item: Item, x: number, y: number) {
        this.item = item;
        this.x = x;
        this.y = y;
    }

    async init(): Promise<void> {
        const sprite = await this.item.createSprite();
        this.sprite = sprite;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.8);
        this.sprite.texture.source.scaleMode = 'nearest';
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.eventMode = 'static';
        this.sprite.on('pointerdown', () => this.collect());
        game.addVisually(this.sprite);
        this.inGrilla = true;
        game.grillaItems.agregarEntidad(this);
    }

    setPosition(x: number, y: number): void {
        const oldX = this.x;
        const oldY = this.y;
        this.x = x;
        this.y = y;
        if (this.sprite) {
            this.sprite.x = x;
            this.sprite.y = y;
        }
        if (this.inGrilla) {
            game.grillaItems.actualizarEntidad(this, oldX, oldY);
        }
    }

    collect(): boolean {
        const slots = game.ui.inventoryUI.slots;
        for (let i = 0; i < slots.length; i++) {
            if (!slots[i].hasItem()) {
                slots[i].setItem(this.item);
                this.destroy();
                return true;
            }
        }
        return false;
    }

    destroy(): void {
        if (this.sprite) {
            game.container?.removeChild(this.sprite);
        }
        if (this.inGrilla) {
            game.grillaItems.removerEntidad(this);
        }
        game.droppedItems.delete(this);
    }
}