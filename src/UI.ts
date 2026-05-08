import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { Item } from './Item.js';
import { game } from './Game.js';
import * as Tools from './Tools.js';

export class UI extends GameObject {
    initialized: boolean = false;
    uiContainer: PIXI.Container = new PIXI.Container();
    toolbar: Toolbar = new Toolbar();

    async init(): Promise<void> {
        if (this.initialized) return;
        await this.createSprite();
        this.render();
        this.initialized = true;
    }

    async createSprite(): Promise<void> {
        this.uiContainer.zIndex = 100;
        this.toolbar.init();
/*         this.toolbar.onUse = () => {
            return this.toolbar.getSelectedItem();
        }; */
        await this.toolbar.addItem_ToSlot_(new Tools.Pala(),0);
        await this.toolbar.addItem_ToSlot_(new Tools.Regadera(),1);
        //await this.toolbar.addItem_ToSlot_(new Item('Regadera', 'regadera'),1);
        this.uiContainer.addChild(this.toolbar.container);
        this.sprite = this.uiContainer as unknown as PIXI.Graphics;
    }

    render(): void {
        game.addVisually(this.uiContainer);
    }
}

class Toolbar {
    container: PIXI.Container = new PIXI.Container();
    slots: Slot[] = [];
    selector: PIXI.Graphics = new PIXI.Graphics();
    selectedSlot: Slot | null = null;
    squareSize: number = 60;
    gap: number = 10;
    onUse: (() => Item) | null = null;

    init(): void {
        const totalWidth = this.squareSize * 4 + this.gap * 3;
        const startX = (game.app!.screen.width - totalWidth) / 2;
        const startY = game.app!.screen.height - this.squareSize - 20;

        this.container.x = startX;
        this.container.y = startY;

        for (let i = 0; i < 4; i++) {
            const slot = new Slot(this.squareSize);
            slot.container.x = i * (this.squareSize + this.gap);
            this.container.addChild(slot.container);
            this.slots.push(slot);
        }

        this.selector.rect(0, 0, this.squareSize, this.squareSize);
        this.selector.stroke({ width: 3, color: 0xffffff });
        this.selector.visible = false;
        this.container.addChild(this.selector);
    }

    async addItem_ToSlot_(item: Item,slot: number): Promise<void> {
        if (slot < 0 || slot >= this.slots.length) return;
        await this.slots[slot].setItem(item);
    }

    getSelectedItem(): Item | null {
        if (this.selectedSlot == null) return null;
        return this.selectedSlot.item;
    }

    selectSlot(nroSlot: number): void {
        if (nroSlot < 0 || nroSlot >= this.slots.length) return;

        this.selectedSlot = this.slots[nroSlot];
        this.selector.x = nroSlot * (this.squareSize + this.gap);
        this.selector.visible = true;
    }

    deselectSlot(): void {
        this.selectedSlot = null;
        this.selector.visible = false;
    }
}
class Slot {
    container: PIXI.Container = new PIXI.Container();
    background: PIXI.Graphics = new PIXI.Graphics();
    itemSprite: PIXI.Sprite | null = null;
    item: Item | null = null;

    constructor(size: number) {
        this.background.rect(0, 0, size, size);
        this.background.fill({ color: 0x000000, alpha: 0.5 });
        this.container.addChild(this.background);
    }

    async setItem(item: Item): Promise<void> {
        this.item = item;
        this.itemSprite = await item.createSprite();
        this.container.addChild(this.itemSprite);
    }
}

