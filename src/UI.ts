import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
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

export class UI extends GameObject {
    initialized: boolean = false;
    uiContainer: PIXI.Container = new PIXI.Container();
    moneyText: PIXI.Text | null = null;
    
    // Sistema de slots unificado
    slots: UI_Slot[] = [];
    selector: PIXI.Graphics = new PIXI.Graphics();
    selectedSlotIndex: number = 0;
    
    // Los últimos 4 slots son seleccionables (hotbar)
    readonly HOTBAR_START_INDEX = 12;
    
    // Panel del inventario
    inventoryContainer: PIXI.Container = new PIXI.Container();
    
    // Estado de arrastre
    private draggingSlotIndex: number = -1;
    private draggingSprite: PIXI.Sprite | null = null;
    private isDraggingPanel: boolean = false;
    private dragOffset: { x: number; y: number } = { x: 0, y: 0 };

    async init(): Promise<void> {
        if (this.initialized) return;
        await this.createSprite();
        this.render();
        this.initialized = true;
    }

    async createSprite(): Promise<void> {
        this.uiContainer.zIndex = 100;
        
        // Mostrar dinero
        this.moneyText = new PIXI.Text({
            text: 'Dinero: $50',
            style: {
                fontSize: 20,
                fill: 0xFFD700,
                stroke: { width: 2, color: 0x000000 }
            }
        });
        this.moneyText.x = 10;
        this.moneyText.y = 10;
        this.uiContainer.addChild(this.moneyText);

        // Crear panel de inventario
        this.inventoryContainer.zIndex = 100;
        this.inventoryContainer.eventMode = 'static';
        this.inventoryContainer.sortableChildren = true;
        
        // Fondo más grande (4x4 = 16 slots)
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
        this.inventoryContainer.addChild(bg);
        
        // Título
        const title = new PIXI.Text({
            text: 'INVENTARIO',
            style: { fontSize: 14, fill: 0xaaaaaa }
        });
        title.x = padding;
        title.y = 8;
        this.inventoryContainer.addChild(title);

        // Crear 16 slots (4x4)
        for (let i = 0; i < cols * rows; i++) {
            const slot = new UI_Slot(slotSize);
            slot.container.x = padding + (i % cols) * (slotSize + gap);
            slot.container.y = 30 + Math.floor(i / cols) * (slotSize + gap);
            slot.slotIndex = i;
            this.slots.push(slot);
            this.inventoryContainer.addChild(slot.container);
        }

        // Selector para los últimos 4 slots
        this.selector.rect(0, 0, slotSize, slotSize);
        this.selector.stroke({ width: 3, color: 0xffff00 });
        this.inventoryContainer.addChild(this.selector);
        
        // Posicionar en la parte inferior
        this.inventoryContainer.x = (game.app!.screen.width - bgWidth) / 2;
        this.inventoryContainer.y = game.app!.screen.height - bgHeight - 20;
        
        this.uiContainer.addChild(this.inventoryContainer);

        // Cargar sprites y agregar herramientas en los últimos 4 slots
        await loadToolbarCropSprites();
        
        // Herramientas en los últimos 4 slots (12-15)
        await this.setSlotItem(12, new Tools.Pala());
        await this.setSlotItem(13, new Tools.Regadera());
        await this.setSlotItem(14, new Tools.Semillas(cropTextures));
        await this.setSlotItem(15, new Tools.Cosecha());
        
        // Seleccionar primer slot del hotbar (slot 12)
        this.selectSlot(this.HOTBAR_START_INDEX);
        
        // Configurar arrastre
        this.setupDrag();
        
        this.sprite = this.uiContainer as unknown as PIXI.Graphics;
    }

    private setupDrag(): void {
        this.inventoryContainer.on('pointerdown', (e: any) => {
            const pos = e.data.global;
            const localX = pos.x - this.inventoryContainer.x;
            const localY = pos.y - this.inventoryContainer.y;
            
            // Verificar si clicó en un slot
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
            
            // Arrastrar panel
            this.isDraggingPanel = true;
            this.dragOffset.x = pos.x - this.inventoryContainer.x;
            this.dragOffset.y = pos.y - this.inventoryContainer.y;
        });

        this.inventoryContainer.on('pointermove', (e: any) => {
            const pos = e.data.global;
            
            if (this.draggingSprite) {
                this.draggingSprite.x = pos.x;
                this.draggingSprite.y = pos.y;
            } else if (this.isDraggingPanel) {
                this.inventoryContainer.x = pos.x - this.dragOffset.x;
                this.inventoryContainer.y = pos.y - this.dragOffset.y;
            }
        });

        this.inventoryContainer.on('pointerup', (e: any) => {
            if (this.draggingSprite) {
                this.handleDrop(e.data.global);
            }
            this.isDraggingPanel = false;
            this.draggingSlotIndex = -1;
        });

        this.inventoryContainer.on('pointerupoutside', () => {
            this.isDraggingPanel = false;
            this.draggingSlotIndex = -1;
        });
    }

    private createDragSprite(slot: UI_Slot, pos: { x: number; y: number }): void {
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
        
        const localX = pos.x - this.inventoryContainer.x;
        const localY = pos.y - this.inventoryContainer.y;
        
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
        
        // Actualizar selección si es necesario
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

    render(): void {
        game.addVisually(this.uiContainer);
    }

    updateMoney(amount: number): void {
        if (this.moneyText) {
            this.moneyText.text = `Dinero: $${amount}`;
        }
    }

    // Seleccionar slot (teclas 1-4 mapped to slots 12-15)
    selectSlot(index: number): void {
        // Solo permitir selección de los últimos 4 slots
        if (index < this.HOTBAR_START_INDEX || index >= this.slots.length) return;
        
        this.selectedSlotIndex = index;
        this.selector.x = this.slots[index].container.x;
        this.selector.y = this.slots[index].container.y;
        this.selector.visible = true;
    }

    // Obtener el item seleccionado para usar
    getSelectedItem(): Item | null {
        if (this.selectedSlotIndex < 0 || this.selectedSlotIndex >= this.slots.length) {
            return null;
        }
        return this.slots[this.selectedSlotIndex].item;
    }

    getAllItems(): Item[] {
        return this.slots.map(slot => slot.item).filter(item => item !== null) as Item[];
    }

    clearSlot(index: number): void {
        if (index < 0 || index >= this.slots.length) return;
        this.slots[index].clear();
    }
}

class UI_Slot {
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