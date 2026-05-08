import * as PIXI from 'pixi.js';
import { Item } from './Item.js';
import { game } from './Game.js';
import * as Tools from './Tools.js';

let cropTextures: Map<string, PIXI.Texture> = new Map();
let toolbarSpritesLoaded = false;

async function loadToolbarCropSprites(): Promise<void> {
    if (toolbarSpritesLoaded) return;
    try {
        const sheet = await PIXI.Assets.load<PIXI.Texture>('Spring Crops/Spring Crops.png');
        for (let i = 0; i < 7; i++) {
            const frame = new PIXI.Rectangle(i * 16, 0, 16, 16);
            const texture = new PIXI.Texture({ source: sheet.source, frame });
            cropTextures.set(`frame_${i}`, texture);
        }
        toolbarSpritesLoaded = true;
    } catch (e) {
        console.error('Error loading toolbar crop sprites:', e);
    }
}

export class InventoryUI {
    container: PIXI.Container = new PIXI.Container();
    slots: InventorySlot[] = [];
    selector: PIXI.Graphics = new PIXI.Graphics();
    selectedSlotIndex: number = 0;
    HOTBAR_START_INDEX = 12;
    
    private draggingSlotIndex: number = -1;
    private draggingSprite: PIXI.Sprite | null = null;
    private isDraggingPanel: boolean = false;
    private dragOffset: { x: number; y: number } = { x: 0, y: 0 };

    async init(): Promise<void> {
        this.container.zIndex = 100;
        this.container.eventMode = 'static';
        this.container.sortableChildren = true;
        
        // Fondo (4x4 = 16 slots)
        const cols = 4;
        const rows = 4;
        const slotSize = 60;
        const gap = 8;
        const padding = 15;
        
        const bgWidth = padding * 2 + cols * slotSize + (cols - 1) * gap;
        const bgHeight = 40 + rows * slotSize + (rows - 1) * gap;
        
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, bgWidth, bgHeight);
        bg.fill({ color: 0x2a2a2a, alpha: 0.95 });
        bg.stroke({ width: 3, color: 0x888888 });
        this.container.addChild(bg);
        
        // Título
        const title = new PIXI.Text({
            text: 'INVENTARIO',
            style: { fontSize: 14, fill: 0xaaaaaa }
        });
        title.x = padding;
        title.y = 8;
        this.container.addChild(title);

        // Crear 16 slots
        for (let i = 0; i < cols * rows; i++) {
            const slot = new InventorySlot(slotSize);
            slot.container.x = padding + (i % cols) * (slotSize + gap);
            slot.container.y = 30 + Math.floor(i / cols) * (slotSize + gap);
            slot.slotIndex = i;
            this.slots.push(slot);
            this.container.addChild(slot.container);
        }

        // Selector
        this.selector.rect(0, 0, slotSize, slotSize);
        this.selector.stroke({ width: 3, color: 0xffff00 });
        this.container.addChild(this.selector);
        
        // Posicionar
        this.container.x = (game.app!.screen.width - bgWidth) / 2;
        this.container.y = game.app!.screen.height - bgHeight - 20;
        
        // Cargar sprites y agregar herramientas
        await loadToolbarCropSprites();
        
        await this.setSlotItem(12, new Tools.Pala());
        await this.setSlotItem(13, new Tools.Regadera());
        await this.setSlotItem(14, new Tools.Semillas(cropTextures));
        await this.setSlotItem(15, new Tools.Cosecha());
        
        this.selectSlot(this.HOTBAR_START_INDEX);
        
        this.setupDrag();
    }

    private setupDrag(): void {
        this.container.on('pointerdown', (e: any) => {
            const pos = e.data.global;
            const localX = pos.x - this.container.x;
            const localY = pos.y - this.container.y;
            
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                const slotX = localX - slot.container.x;
                const slotY = localY - slot.container.y;
                
                if (slotX >= 0 && slotX < 60 && slotY >= 0 && slotY < 60) {
                    if (slot.hasItem()) {
                        this.draggingSlotIndex = i;
                        this.createDragSprite(slot, pos);
                        return;
                    }
                }
            }
            
            this.isDraggingPanel = true;
            this.dragOffset.x = pos.x - this.container.x;
            this.dragOffset.y = pos.y - this.container.y;
        });

        this.container.on('pointermove', (e: any) => {
            const pos = e.data.global;
            
            if (this.draggingSprite) {
                this.draggingSprite.x = pos.x;
                this.draggingSprite.y = pos.y;
            } else if (this.isDraggingPanel) {
                this.container.x = pos.x - this.dragOffset.x;
                this.container.y = pos.y - this.dragOffset.y;
            }
        });

        this.container.on('pointerup', (e: any) => {
            if (this.draggingSprite) {
                this.handleDrop(e.data.global);
            }
            this.isDraggingPanel = false;
            this.draggingSlotIndex = -1;
        });

        this.container.on('pointerupoutside', () => {
            this.isDraggingPanel = false;
            this.draggingSlotIndex = -1;
        });
    }

    private createDragSprite(slot: InventorySlot, pos: { x: number; y: number }): void {
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

    private handleDrop(pos: { x: number; y: number }): void {
        if (!this.draggingSprite || this.draggingSlotIndex < 0) return;
        
        const localX = pos.x - this.container.x;
        const localY = pos.y - this.container.y;
        
        let targetIndex = -1;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            const slotX = localX - slot.container.x;
            const slotY = localY - slot.container.y;
            
            if (slotX >= 0 && slotX < 60 && slotY >= 0 && slotY < 60) {
                targetIndex = i;
                break;
            }
        }
        
        if (targetIndex >= 0 && targetIndex !== this.draggingSlotIndex) {
            this.swapSlots(this.draggingSlotIndex, targetIndex);
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

    selectSlot(index: number): void {
        if (index < this.HOTBAR_START_INDEX || index >= this.slots.length) return;
        
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
}

class InventorySlot {
    container: PIXI.Container = new PIXI.Container();
    background: PIXI.Graphics = new PIXI.Graphics();
    itemSprite: PIXI.Sprite | null = null;
    item: Item | null = null;
    slotIndex: number = 0;
    size: number = 60;

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
    }

    hasItem(): boolean {
        return this.item !== null;
    }

    clear(): void {
        if (this.itemSprite) {
            this.container.removeChild(this.itemSprite);
            this.itemSprite = null;
        }
        this.item = null;
    }

    getItemTexture(): PIXI.Texture | null {
        if (this.item?.sprite) {
            return this.item.sprite.texture;
        }
        return null;
    }
}