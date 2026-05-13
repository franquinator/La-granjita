import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { Vector2D } from './types.js';
import { game } from './Game.js';
import { Crop, CropType } from './Crop.js';
import { loadCropTextures, getCropTexture } from './CropTextures.js';
import { Item } from './Item.js';

export class Tile extends GameObject {
    color: number;
    size: number;
    type: string;
    plantSprite: PIXI.Sprite | null = null;

    constructor(type: string, color: number, size: number, x: number, y: number) {
        super();
        this.type = type;
        this.color = color;
        this.size = size;

        this.sprite = new PIXI.Graphics();
        this.redrawTile();

        this.sprite.x = x * size;
        this.sprite.y = y * size;

        this.sprite.zIndex = -1;

        game.addVisually(this.sprite);
    }

    redrawTile(): void {
        if (!this.sprite) return;
        this.sprite.rect(0, 0, this.size, this.size);
        this.sprite.fill(this.color);
        this.sprite.stroke({ width: 1, color: this.color });
    }

    init(): void { }

    destroy(): void {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}

export class Soil extends Tile {
    humedo: boolean = false;
    planta: Crop | null = null;
    container: PIXI.Container = new PIXI.Container();
    private dryIntervalId: number | null = null;
    private static readonly DRY_TIME: number = 20000;
    constructor(size: number, x: number = 0, y: number = 0) {
        super('soil', 0xB58C00, size, x, y);
        this.sprite!.zIndex = -12;

        loadCropTextures();
    }

    humedecer(): void {
        this.humedo = true;
        this.color = 0x826400;
        this.startDryTimer();
        this.actualizarSprite()
    }

    private startDryTimer(): void {
        if (this.dryIntervalId !== null) {
            clearTimeout(this.dryIntervalId);
        }
        this.dryIntervalId = window.setTimeout(() => {
            this.secarse();
        }, Soil.DRY_TIME);
    }

    private secarse(): void {
        this.humedo = false;
        this.color = 0xB58C00;
        this.actualizarSprite();
    }
    
    private actualizarSprite(){
        if (this.sprite) {
            this.sprite.clear();
            this.redrawTile();
        }
    }

    plantar(tipo: CropType): void {
        if (this.humedo && !this.planta) {
            this.container.x = this.sprite!.x;
            this.container.y = this.sprite!.y;
            game.addVisually(this.container);

            this.planta = new Crop(tipo, this.container);
        }
    }

    harvest(): void {
        this.planta!.harvest();
        this.planta = null;
    }

    esPlantaLista(): boolean {
        return this.planta !== null && this.planta.isReady;
    }
    tienePlanta(): boolean {
        return this.planta !== null;
    }
}

export class WetSoil extends Tile {
    constructor(size: number, x: number = 0, y: number = 0) {
        super('wetSoil', 0x826400, size, x, y);
        this.sprite!.zIndex = -12;
    }
}

export class Pasture extends Tile {
    constructor(size: number, x: number = 0, y: number = 0) {
        super('pasture', 0x24CA3D, size, x, y);
    }
}

export class Terrain extends GameObject {
    tiles: Tile[][] = [];
    tileSize: number = 40;
    width: number;
    height: number;

    constructor(width: number, height: number, tileSize: number = 40) {
        super();
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
    }

    init(): void {
        this.generateTiles();
    }

    generateTiles(): void {
        for (let y = 0; y < this.height; y++) {
            const row: Tile[] = [];
            for (let x = 0; x < this.width; x++) {
                const tile = new Pasture(this.tileSize, x, y);
                row.push(tile);
            }
            this.tiles.push(row);
        }
    }

    convertToSoil(pos: Vector2D): void {
        const col = Math.floor(pos.x / this.tileSize);
        const row = Math.floor(pos.y / this.tileSize);
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) return;

        this.tiles[row][col].destroy();
        const newTile = new Soil(this.tileSize, col, row);
        this.tiles[row][col] = newTile;
    }

    // convertToWetSoil(pos: Vector2D): void {
    //     const col = Math.floor(pos.x / this.tileSize);
    //     const row = Math.floor(pos.y / this.tileSize);
    //     if (row < 0 || row >= this.height || col < 0 || col >= this.width) return;
    //     if (this.tiles[row][col].type !== 'soil') return;

    //     this.tiles[row][col].destroy();
    //     const newTile = new WetSoil(this.tileSize, col, row);
    //     this.tiles[row][col] = newTile;
    // }

    getGridPosition(pos: Vector2D): Vector2D {
        return new Vector2D(
            Math.floor(pos.x / this.tileSize),
            Math.floor(pos.y / this.tileSize));
    }
    getTilePosition(pos: Vector2D): Vector2D {
        return new Vector2D(
            Math.floor(pos.x / this.tileSize) * this.tileSize,
            Math.floor(pos.y / this.tileSize) * this.tileSize);
    }
    getTileAtPosition(pos: Vector2D): Tile | null {
        const col = Math.floor(pos.x / this.tileSize);
        const row = Math.floor(pos.y / this.tileSize);
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) return null;
        return this.tiles[row][col];
    }
}