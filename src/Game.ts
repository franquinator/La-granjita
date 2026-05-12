import * as PIXI from 'pixi.js';
import { Input } from './Input';
import { Player } from './Player';
import { Marco } from './Marco';
import { GameObject } from './GameObject';
import { Terrain } from './Terrain';
import { UI } from './UI';
import { Item } from './Item';
import { DroppedItem } from './DroppedItem';
import { Grilla } from './Grilla';

export const CONFIG = {
    MARCO_SIZE: 50,
    MAP_WIDTH: 25,
    MAP_HEIGHT: 12,
    TILE_SIZE: 50,
    PLAYER_WIDTH: 40,
    PLAYER_HEIGHT: 40,
    PLAYER_COLOR: 0xff6b6b,
    PLAYER_SPEED: 300,
    INITIAL_MONEY: 50,
    GRID_CELL_SIZE: 100,
    BACKGROUND_COLOR: 0x228b22,
    INTERACTION_RANGE: 50
} as const;

export class Game {
    app: PIXI.Application | null = null;
    container: PIXI.Container | null = null;

    player: Player;
    terrain: Terrain;

    input: Input;
    ui: UI;
    marco: Marco;

    updateGameObjects: Set<GameObject> = new Set();
    droppedItems: Set<DroppedItem> = new Set();
    grillaItems: Grilla;

    money: number = 0;

    constructor() {
        this.input = new Input();
        this.ui = new UI();
        this.marco = new Marco(CONFIG.MARCO_SIZE);
        this.terrain = new Terrain(CONFIG.MAP_WIDTH, CONFIG.MAP_HEIGHT, CONFIG.TILE_SIZE);
        this.player = new Player({
            width: CONFIG.PLAYER_WIDTH,
            height: CONFIG.PLAYER_HEIGHT,
            color: CONFIG.PLAYER_COLOR,
            speed: CONFIG.PLAYER_SPEED
        });
        this.grillaItems = new Grilla();
        this.money = CONFIG.INITIAL_MONEY;
    }

    async init(): Promise<void> {
        try {
            this.app = new PIXI.Application();

            await this.app.init({
                resizeTo: window,
                backgroundColor: CONFIG.BACKGROUND_COLOR,
                antialias: true,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true
            });

            document.body.appendChild(this.app.canvas);
            this.app.stage.sortableChildren = true;

            this.container = new PIXI.Container();
            this.app.stage.addChild(this.container);
            this.container.addChild(this.grillaItems.graphics);

            this.marco.init();
            this.player.init();
            this.terrain.init();
            this.ui.init();
            this.grillaItems.init(this.app.screen.width, this.app.screen.height, CONFIG.GRID_CELL_SIZE);

            this.input.subscribe(() => this.grillaItems.toggleDebug(), ['KeyC']);

            this.app.ticker.add((ticker) => {
                const delta = ticker.deltaTime / 60;
                this.update(delta);
            });
        } catch (error) {
            console.error('Error initializing game:', error);
            throw error;
        }
    }

    async dropItem(item: Item, x: number, y: number): Promise<void> {
        const dropped = new DroppedItem(item, x, y);
        await dropped.init();
        this.droppedItems.add(dropped);
    }

    addToUpdate(obj: GameObject): void {
        this.updateGameObjects.add(obj);
    }

    removeFromUpdate(obj: GameObject): void {
        this.updateGameObjects.delete(obj);
    }

    addVisually(sprite: PIXI.Container | null): void {
        if (sprite === null) {
            throw new Error('Sprite is null');
        }
        this.container?.addChild(sprite);
    }

    update(delta: number): void {
        this.updateGameObjects.forEach(gameObject => gameObject.update(delta, this));
    }

    getObjectAt(x: number, y: number, range: number = CONFIG.INTERACTION_RANGE): GameObject | null {
        for (const obj of this.updateGameObjects) {
            if (obj === this.player) continue;
            const dx = Math.abs(x - obj.x);
            const dy = Math.abs(y - obj.y);
            if (dx < range && dy < range) return obj;
        }
        return null;
    }

    destroy(): void {
        this.updateGameObjects.forEach(obj => {
            if ('destroy' in obj && typeof obj.destroy === 'function') {
                obj.destroy();
            }
        });
        this.updateGameObjects.clear();
        this.droppedItems.forEach(item => item.destroy());
        this.droppedItems.clear();
        this.app?.destroy(true, { children: true, texture: false });
    }
}

export const game = new Game();