import * as PIXI from 'pixi.js';
import { Item } from './Item.js';
import { game } from './Game.js';
import * as Tools from './Tools.js';

const SLOT_SIZE = 60;
const GRID_COLS = 4;
const GRID_ROWS = 4;
const TOTAL_SLOTS = GRID_COLS * GRID_ROWS;
const HOTBAR_START_INDEX = 12;
const GAP = 8;
const PADDING = 15;

class InventorySlot {
    container: PIXI.Container = new PIXI.Container();
    background: PIXI.Graphics = new PIXI.Graphics();
    itemSprite: PIXI.Sprite | null = null;
    item: Item | null = null;
    size: number = SLOT_SIZE;
    private quantityText: PIXI.Text | null = null;

    constructor(slotSize: number) {
        this.size = slotSize;
        this.background.rect(0, 0, slotSize, slotSize);
        this.background.fill({ color: 0x444444 });
        this.background.stroke({ width: 1, color: 0x666666 });
        this.container.addChild(this.background);
    }

    async setItem(item: Item): Promise<void> {
        this.clear();
        this.item = item;
        const sprite = await item.createSprite();
        this.itemSprite = sprite;
        this.itemSprite.zIndex = 10;
        this.itemSprite.x = (this.size - sprite.width) / 2;
        this.itemSprite.y = (this.size - sprite.height) / 2;
        this.container.addChild(this.itemSprite);
        this.updateQuantityDisplay();
    }

    hasItem(): boolean {
        return this.item !== null;
    }

    clear(): void {
        if (this.itemSprite) {
            this.container.removeChild(this.itemSprite);
            this.itemSprite = null;
        }
        if (this.quantityText) {
            this.container.removeChild(this.quantityText);
            this.quantityText = null;
        }
        this.item = null;
    }

    getItemTexture(): PIXI.Texture | null {
        if (this.item?.sprite) {
            return this.item.sprite.texture;
        }
        return null;
    }

    updateQuantityDisplay(): void {
        if (this.quantityText) {
            this.container.removeChild(this.quantityText);
            this.quantityText = null;
        }
        if (this.item && this.item.quantity > 1) {
            this.quantityText = new PIXI.Text({
                text: this.item.quantity.toString(),
                style: { fontSize: 16, fill: 0xffffff, stroke: { width: 2, color: 0x000000 } }
            });
            this.quantityText.anchor.set(1, 1);
            this.quantityText.x = this.size - 2;
            this.quantityText.y = this.size - 2;
            this.quantityText.zIndex = 10;
            this.container.addChild(this.quantityText);
        }
    }
}

export class InventoryUI {
    container: PIXI.Container = new PIXI.Container();
    slots: InventorySlot[] = [];
    selector: PIXI.Graphics = new PIXI.Graphics();
    selectedSlotIndex: number = 0;

    private background: PIXI.Graphics | null = null;
    private title: PIXI.Text | null = null;
    private draggingSlotIndex: number = -1;
    private draggingSprite: PIXI.Sprite | null = null;
    private expanded: boolean = true;

    async init(): Promise<void> {
        this.createContainer();
        this.createBackground();
        this.createSlots();
        this.createSelector();
        this.loadItems();
        this.setupDrag();
        this.toggleExpanded();
        game.input.subscribe(() => this.toggleExpanded(), ['KeyI']);
    }

    private createContainer(): void {
        this.container.zIndex = 100;
        this.container.eventMode = 'static';
        this.container.sortableChildren = true;
    }

    private createBackground(): void {
        const bgWidth = PADDING * 2 + GRID_COLS * SLOT_SIZE + (GRID_COLS - 1) * GAP;
        const bgHeight = 40 + GRID_ROWS * SLOT_SIZE + (GRID_ROWS - 1) * GAP;

        this.background = new PIXI.Graphics();
        this.background.rect(0, 0, bgWidth, bgHeight);
        this.background.fill({ color: 0x2a2a2a, alpha: 0.95 });
        this.background.stroke({ width: 3, color: 0x888888 });
        this.container.addChild(this.background);

        this.title = new PIXI.Text({
            text: 'INVENTARIO',
            style: { fontSize: 14, fill: 0xaaaaaa }
        });
        this.title.x = PADDING;
        this.title.y = 8;
        this.container.addChild(this.title);

        this.container.x = (game.app!.screen.width - bgWidth) / 2;
        this.container.y = game.app!.screen.height - bgHeight - 20;
    }

    private createSlots(): void {
        for (let i = 0; i < TOTAL_SLOTS; i++) {
            const slot = new InventorySlot(SLOT_SIZE);
            slot.container.x = PADDING + (i % GRID_COLS) * (SLOT_SIZE + GAP);
            slot.container.y = 30 + Math.floor(i / GRID_COLS) * (SLOT_SIZE + GAP);
            this.slots.push(slot);
            this.container.addChild(slot.container);
        }
    }

    private createSelector(): void {
        this.selector.rect(0, 0, SLOT_SIZE, SLOT_SIZE);
        this.selector.stroke({ width: 3, color: 0xffff00 });
        this.container.addChild(this.selector);
    }

    private async loadItems(): Promise<void> {
        await this.setSlotItem(12, new Tools.Pala());
        await this.setSlotItem(13, new Tools.Regadera());
        const semillas = new Tools.Semillas();
        semillas.quantity = 10;
        await this.setSlotItem(14, semillas);
        await this.setSlotItem(15, new Tools.Cosecha());
        this.selectSlot(HOTBAR_START_INDEX);
    }

    private setupDrag(): void {
        this.container.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if(!this.expanded)return;
            const pos = e.global;
            const localX = pos.x - this.container.x;
            const localY = pos.y - this.container.y;

            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                const slotX = localX - slot.container.x;
                const slotY = localY - slot.container.y;

                if (slotX >= 0 && slotX < SLOT_SIZE && slotY >= 0 && slotY < SLOT_SIZE) {
                    if (slot.hasItem()) {
                        this.draggingSlotIndex = i;
                        this.createDragSprite(slot, pos);
                        return;
                    }
                }
            }
        });

        this.container.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            const pos = e.global;
            if (this.draggingSprite) {
                this.draggingSprite.x = pos.x;
                this.draggingSprite.y = pos.y;
            }
        });

        const handlePointerUp = (e: PIXI.FederatedPointerEvent) => {
            if (this.draggingSprite) {
                this.handleDrop(e.global);
            }
            this.draggingSlotIndex = -1;
        };

        this.container.on('pointerup', handlePointerUp);
        this.container.on('pointerupoutside', handlePointerUp);
    }

    private createDragSprite(slot: InventorySlot, pos: PIXI.Point): void {
        const texture = slot.getItemTexture();
        if (texture) {
            this.draggingSprite = new PIXI.Sprite(texture);
            this.draggingSprite.scale.set(slot.size / 32);
            this.draggingSprite.anchor.set(0.5);
            this.draggingSprite.x = pos.x;
            this.draggingSprite.y = pos.y;
            this.draggingSprite.zIndex = 200;
            game.app?.stage.addChild(this.draggingSprite);
        }
    }

    private handleDrop(pos: PIXI.Point): void {
        if (!this.draggingSprite || this.draggingSlotIndex < 0) return;

        const localX = pos.x - this.container.x;
        const localY = pos.y - this.container.y;

        let targetIndex = -1;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            const slotX = localX - slot.container.x;
            const slotY = localY - slot.container.y;

            if (slotX >= 0 && slotX < SLOT_SIZE && slotY >= 0 && slotY < SLOT_SIZE) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex >= 0 && targetIndex !== this.draggingSlotIndex) {
            this.swapSlots(this.draggingSlotIndex, targetIndex);
        } else if (targetIndex < 0) {
            const item = this.slots[this.draggingSlotIndex].item;
            if (item) {
                this.clearSlot(this.draggingSlotIndex);
                game.dropItem(item, pos.x, pos.y);
            }
        }

        game.app?.stage.removeChild(this.draggingSprite);
        this.draggingSprite = null;
    }

    async swapSlots(indexA: number, indexB: number): Promise<void> {
        if (indexA < 0 || indexA >= this.slots.length || indexB < 0 || indexB >= this.slots.length) return;

        const itemA = this.slots[indexA].item;
        const itemB = this.slots[indexB].item;

        this.slots[indexA].clear();
        this.slots[indexB].clear();

        if (itemA) await this.setSlotItem(indexB, itemA);
        if (itemB) await this.setSlotItem(indexA, itemB);

        if (this.selectedSlotIndex === indexA) {
            this.selectSlot(indexB);
        } else if (this.selectedSlotIndex === indexB) {
            this.selectSlot(indexA);
        }
    }

    async setSlotItem(index: number, item: Item): Promise<void> {
        if (index < 0 || index >= this.slots.length) return;
        await this.slots[index].setItem(item);
    }

    async addItem(item: Item): Promise<boolean> {
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (slot.item && slot.item.name === item.name) {
                const espacio = item.maxStack - slot.item.quantity;
                if (espacio > 0) {
                    const cantidadAAgregar = Math.min(espacio, item.quantity);
                    slot.item.quantity += cantidadAAgregar;
                    item.quantity -= cantidadAAgregar;
                    slot.updateQuantityDisplay();
                    if (item.quantity <= 0) return true;
                }
            }
        }
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i].hasItem()) {
                await this.setSlotItem(i, item);
                return true;
            }
        }
        return false;
    }

    clearSlot(index: number): void {
        if (index < 0 || index >= this.slots.length) return;
        this.slots[index].clear();
    }

    selectSlot(index: number): void {
        if (index < HOTBAR_START_INDEX || index >= this.slots.length) return;

        this.selectedSlotIndex = index;
        this.selector.x = this.slots[index].container.x;
        this.selector.y = this.slots[index].container.y;
        this.selector.visible = true;
    }

    getSelectedItem(): Item | null {
        if (this.selectedSlotIndex < 0 || this.selectedSlotIndex >= this.slots.length) {
            return null;
        }
        return this.slots[this.selectedSlotIndex].item;
    }

    getAllItems(): Item[] {
        return this.slots.map(slot => slot.item).filter(item => item !== null) as Item[];
    }

    refreshSelectedSlot(): void {
        const slot = this.slots[this.selectedSlotIndex];
        if (slot.item && slot.item.quantity <= 0) {
            slot.clear();
        } else if (slot.item) {
            slot.updateQuantityDisplay();
        }
    }

    toggleExpanded(): void {
        this.expanded = !this.expanded;
        this.background!.visible = this.expanded;
        this.title!.visible = this.expanded;
        for (let i = 0; i < HOTBAR_START_INDEX; i++) {
            this.slots[i].container.visible = this.expanded;
        }
    }
}