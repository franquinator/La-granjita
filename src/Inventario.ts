import * as PIXI from 'pixi.js';
import { game } from './Game.js';
import { Item } from './Item.js';
import { ITEM_COLORS } from './Inventory.js';

/**
 * Clase principal del panel de inventario.
 * Maneja la visualización, arrastre e interacción con los items.
 */
export class Inventario {
    // Contenedor principal del inventario (fondo + slots)
    container: PIXI.Container = new PIXI.Container();
    
    // Array de slots donde se muestran los items
    slots: InventarioSlot[] = [];
    
    // Estado del arrastre del panel completo (para mover la ventana)
    private isDraggingPanel: boolean = false;
    private dragOffset: { x: number; y: number } = { x: 0, y: 0 };
    
    // Estado del arrastre de un item (para mover entre slots)
    private draggingSprite: PIXI.Sprite | null = null;
    private draggingSlotIndex: number = -1;

    /**
     * Inicializa el inventario: crea el fondo, título y los 20 slots (4x5).
     */
    init(): void {
        // Posición inicial del panel en pantalla
        this.container.x = 100;
        this.container.y = 100;
        // Z-index alto para que aparezca sobre otros elementos
        this.container.zIndex = 150;

        // === CREAR FONDO ===
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, 320, 300);  // 320x300 pixels
        bg.fill({ color: 0x2a2a2a, alpha: 0.95 });  // Color gris oscuro semi-transparente
        bg.stroke({ width: 3, color: 0x888888 });    // Borde gris
        this.container.addChild(bg);

        // === CREAR TÍTULO ===
        const title = new PIXI.Text({
            text: 'INVENTARIO',
            style: { fontSize: 18, fill: 0xffffff }
        });
        title.x = 10;
        title.y = 10;
        this.container.addChild(title);

        // === CREAR SLOTS ===
        const cols = 4;       // 4 columnas
        const rows = 5;       // 5 filas = 20 slots total
        const slotSize = 60;  // Tamaño de cada slot en pixels
        const gap = 8;        // Espacio entre slots

        // Crear los 20 slots en posición
        for (let i = 0; i < cols * rows; i++) {
            const slot = new InventarioSlot(slotSize);
            
            // Calcular posición en grilla:
            // - i % cols = columna (0-3)
            // - floor(i / cols) = fila (0-4)
            slot.container.x = 20 + (i % cols) * (slotSize + gap);
            slot.container.y = 40 + Math.floor(i / cols) * (slotSize + gap);
            slot.slotIndex = i;
            
            this.slots.push(slot);
            this.container.addChild(slot.container);
        }

        // Configurar eventos de arrastre
        this.setupDrag();
    }

    /**
     * Configura los eventos de mouse/touch para el arrastre:
     * - Arrastrar items entre slots
     * - Arrastrar el panel completo
     */
    private setupDrag(): void {
        // Habilitar eventos en el contenedor
        this.container.eventMode = 'static';
        this.container.hitArea = new PIXI.Rectangle(0, 0, 320, 300);

        // === POINTER DOWN: Iniciar arrastre ===
        this.container.on('pointerdown', (e: any) => {
            // Posición global del mouse
            const pos = e.data.global;
            // Posición relativa al contenedor del inventario
            const localX = pos.x - this.container.x;
            const localY = pos.y - this.container.y;

            // 1. Verificar si clicó sobre un slot con item
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                // Posición dentro del slot
                const slotLocalX = localX - slot.container.x;
                const slotLocalY = localY - slot.container.y;
                
                // ¿Clicó dentro del slot y tiene item?
                if (slotLocalX >= 0 && slotLocalX < 60 && slotLocalY >= 0 && slotLocalY < 60) {
                    if (slot.hasItem()) {
                        // Iniciar arrastre de item
                        this.draggingSlotIndex = i;
                        this.createDragSprite(slot, pos);
                        return;  // No iniciar arrastre de panel
                    }
                }
            }

            // 2. Si no hay slot, iniciar arrastre del panel
            this.isDraggingPanel = true;
            this.dragOffset.x = pos.x - this.container.x;
            this.dragOffset.y = pos.y - this.container.y;
        });

        // === POINTER MOVE: Mover ===
        this.container.on('pointermove', (e: any) => {
            const pos = e.data.global;
            
            // Si está arrastrando un item, mover el sprite
            if (this.draggingSprite) {
                this.draggingSprite.x = pos.x;
                this.draggingSprite.y = pos.y;
            } 
            // Si está arrastrando el panel, mover el contenedor
            else if (this.isDraggingPanel) {
                this.container.x = pos.x - this.dragOffset.x;
                this.container.y = pos.y - this.dragOffset.y;
            }
        });

        // === POINTER UP: Soltar ===
        this.container.on('pointerup', (e: any) => {
            if (this.draggingSprite) {
                // Procesar dropped del item
                this.handleDrop(e.data.global);
            }
            this.isDraggingPanel = false;
            this.draggingSlotIndex = -1;
        });

        // === POINTER UP OUTSIDE: Soltar fuera ===
        this.container.on('pointerupoutside', () => {
            this.isDraggingPanel = false;
            this.draggingSlotIndex = -1;
        });
    }

    /**
     * Crea un sprite temporal para mostrar mientras se arrastra un item.
     * Se agrega al stage (no al container del inventario) para que flote sobre todo.
     */
    private createDragSprite(slot: InventarioSlot, pos: { x: number; y: number }): void {
        // Obtener la textura del item (ya sea herramienta o item genérico)
        const texture = slot.getDragTextureSync();
        
        if (texture) {
            this.draggingSprite = new PIXI.Sprite(texture);
            this.draggingSprite.scale.set(slot.size / 32);  // Escalar al tamaño del slot
            this.draggingSprite.anchor.set(0.5);            // Centrar anclaje
            this.draggingSprite.x = pos.x;
            this.draggingSprite.y = pos.y;
            this.draggingSprite.zIndex = 200;                // Siempre visible
            game.app?.stage.addChild(this.draggingSprite);   // Agregar al stage
        } else {
            // Si no tiene textura, crear un sprite genérico
            const g = new PIXI.Graphics();
            g.circle(0, 0, 20);
            g.fill(0xFFFFFF);
            this.draggingSprite = new PIXI.Sprite(game.app?.renderer.generateTexture(g) || undefined);
            this.draggingSprite.anchor.set(0.5);
            this.draggingSprite.x = pos.x;
            this.draggingSprite.y = pos.y;
            this.draggingSprite.zIndex = 200;
            game.app?.stage.addChild(this.draggingSprite);
        }
    }

    /**
     * Procesa cuando se suelta un item arrastrado.
     * Determina en qué slot cayó y realiza el intercambio si corresponde.
     */
    private handleDrop(pos: { x: number; y: number }): void {
        if (!this.draggingSprite || this.draggingSlotIndex < 0) return;

        // Posición donde se soltó, relativa al inventario
        const localX = pos.x - this.container.x;
        const localY = pos.y - this.container.y;

        // Buscar en qué slot cayó
        let targetIndex = -1;
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            const slotLocalX = localX - slot.container.x;
            const slotLocalY = localY - slot.container.y;
            
            if (slotLocalX >= 0 && slotLocalX < 60 && slotLocalY >= 0 && slotLocalY < 60) {
                targetIndex = i;
                break;
            }
        }

        // Si cayó en un slot diferente, intercambiar
        if (targetIndex >= 0 && targetIndex !== this.draggingSlotIndex) {
            this.swapItems(this.draggingSlotIndex, targetIndex);
        }

        // Limpiar sprite de arrastre
        game.app?.stage.removeChild(this.draggingSprite);
        this.draggingSprite = null;
    }

    /**
     * Intercambia items entre dos slots.
     * Ahora todos los slots son del mismo tipo - simplemente intercambia el contenido.
     */
    private swapItems(fromIndex: number, toIndex: number): void {
        const fromSlot = this.slots[fromIndex];
        const toSlot = this.slots[toIndex];
        
        // Intercambiar storedItem
        const tempItem = fromSlot.storedItem;
        const tempName = fromSlot.storedItemName;
        
        // Limpiar y mover
        fromSlot.storedItem = toSlot.storedItem;
        fromSlot.storedItemName = toSlot.storedItemName;
        
        toSlot.storedItem = tempItem;
        toSlot.storedItemName = tempName;
        
        // Actualizar visualización
        this.refresh();
    }

    /**
     * Actualiza la visualización de todos los slots.
     * Los primeros 4 slots son herramientas (del jugador), los demás son items del inventario.
     */
    refresh(): void {
        // Los slots ya tienen su contenido actualizado por swap/arrastre
        // Solo necesitamos asegurarnos que el inventario del jugador refleje los items
        const inv = game.player.inventory;
        
        // Sincronizar: los slots 4+ son items del inventario
        if (inv) {
            const items: any[] = [];
            for (let i = 4; i < this.slots.length; i++) {
                const slot = this.slots[i];
                if (slot.storedItemName) {
                    items.push({ id: slot.storedItemName, name: slot.storedItemName, count: 1 });
                }
            }
            // Reemplazar el inventory con los items de los slots
            inv.clear();
            items.forEach(item => inv.addItem(item, 1));
        }
    }

    /** Muestra el inventario y actualiza los items */
    show(): void {
        this.container.visible = true;
        this.refresh();
    }

    /** Oculta el inventario */
    hide(): void {
        this.container.visible = false;
    }

    /** Alterna entre visible y oculto */
    toggle(): void {
        if (this.container.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

/**
 * Representa un solo slot del inventario.
 * Puede contener una herramienta o un item genérico (semilla, etc.)
 */
export class InventarioSlot {
    // Contenedor del slot
    container: PIXI.Container = new PIXI.Container();
    // Rectángulo de fondo del slot
    background: PIXI.Graphics = new PIXI.Graphics();
    // Sprite del item (para herramientas)
    itemSprite: PIXI.Sprite | null = null;
    // Gráfico del item (para items genéricos - semillas, cosechas)
    itemGraphic: PIXI.Graphics | null = null;
    // Texto que muestra la cantidad (para items)
    countText: PIXI.Text | null = null;
    // Índice del slot en el inventario
    slotIndex: number = 0;
    // Tamaño del slot (60px)
    size: number = 60;
    // Referencia a la herramienta (si es slot de herramienta)
    storedItem: Item | null = null;
    // Nombre del item (para items genéricos)
    storedItemName: string | null = null;

    constructor(slotSize: number) {
        this.size = slotSize;
        
        // Crear fondo del slot
        this.background.rect(0, 0, slotSize, slotSize);
        this.background.fill({ color: 0x444444 });   // Gris oscuro
        this.background.stroke({ width: 1, color: 0x666666 });  // Borde gris claro
        this.container.addChild(this.background);
    }

    /**
     * Muestra un item genérico (semilla, cosechas).
     * Dibuja un círculo de color según el tipo y muestra la cantidad.
     */
    setItem(name: string, count: number, color?: number): void {
        this.clear();  // Limpiar slot primero

        this.storedItemName = name;  // Guardar nombre para arrastre

        // Usar color proporcionado o el color por defecto
        const itemColor = color || ITEM_COLORS[name] || 0xFFFFFF;

        // Dibujar círculo de color
        this.itemGraphic = new PIXI.Graphics();
        this.itemGraphic.circle(this.size / 2, this.size / 2, this.size / 2 - 8);
        this.itemGraphic.fill(itemColor);
        this.container.addChild(this.itemGraphic);

        // Mostrar cantidad
        this.countText = new PIXI.Text({
            text: count.toString(),
            style: { fontSize: 14, fill: 0xFFFFFF }
        });
        this.countText.x = this.size - 18;  // Esquina inferior derecha
        this.countText.y = this.size - 18;
        this.container.addChild(this.countText);
    }

    /** Verifica si el slot tiene algo */
    hasItem(): boolean {
        return this.storedItem !== null || this.storedItemName !== null;
    }

    /**
     * Obtiene la textura para usar durante el arrastre.
     * Crea una textura a partir del gráfico o sprite.
     */
    getDragTexture(): PIXI.Texture | null {
        // Método deprecated, usar getDragTextureSync
        return null;
    }

    /**
     * Obtiene la textura para arrastre de forma sincrónica.
     */
    getDragTextureSync(): PIXI.Texture | null {
        // Para herramientas: usar el sprite
        if (this.storedItem?.sprite) {
            return this.storedItem.sprite.texture;
        }
        
        // Para items genéricos: crear textura basada en color
        if (this.storedItemName) {
            const color = ITEM_COLORS[this.storedItemName] || 0xFFFFFF;
            
            // Crear un graphics para usar como textura
            const g = new PIXI.Graphics();
            g.circle(16, 16, 14);
            g.fill(color);
            return game.app?.renderer.generateTexture(g) || null;
        }
        
        return null;
    }

    /**
     * Muestra una herramienta en el slot.
     * Copia el sprite de la herramienta.
     */
    async setTool(item: Item): Promise<void> {
        this.clear();
        this.storedItem = item;  // Guardar referencia
        this.storedItemName = null;
        
        if (item.sprite) {
            // Crear copia del sprite
            this.itemSprite = new PIXI.Sprite(item.sprite.texture);
            this.itemSprite.scale.set(this.size / 32);  // Escalar al tamaño del slot
            this.itemSprite.x = (this.size - this.itemSprite.width) / 2;   // Centrar
            this.itemSprite.y = (this.size - this.itemSprite.height) / 2;
            this.container.addChild(this.itemSprite);
        }
    }

    /** Limpia el slot (quita todos los elementos excepto el fondo) */
    clear(): void {
        this.storedItem = null;
        this.storedItemName = null;
        
        if (this.itemSprite) {
            this.container.removeChild(this.itemSprite);
            this.itemSprite = null;
        }
        
        if (this.itemGraphic) {
            this.container.removeChild(this.itemGraphic);
            this.itemGraphic = null;
        }
        
        if (this.countText) {
            this.container.removeChild(this.countText);
            this.countText = null;
        }
        
        // Remover todos los hijos excepto el fondo
        for (let i = this.container.children.length - 1; i >= 0; i--) {
            if (this.container.children[i] !== this.background) {
                this.container.removeChild(this.container.children[i]);
            }
        }
    }
}