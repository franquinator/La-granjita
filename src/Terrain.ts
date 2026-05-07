import * as PIXI from 'pixi.js';
import { GameObject} from './GameObject.js';
import { Vector2D } from './types.js';
import { game } from './game.js';

export class Tile extends GameObject {
    color: number;
    size: number;
    type: string;

    constructor(type: string, color: number, size: number, x:number, y:number) {
        super();
        this.type = type;
        this.color = color;
        this.size = size;

        this.sprite = new PIXI.Graphics();
        this.sprite.rect(0, 0, this.size, this.size);
        this.sprite.fill(this.color);
        this.sprite.stroke({ width: 1, color: this.color });

        this.sprite.x = x * size;
        this.sprite.y = y * size;

        this.sprite.zIndex = -1;

        game.addVisually(this.sprite);
    }

    init(): void {}
    
    destroy(): void {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}

export class Soil extends Tile {
    constructor(size: number, x: number = 0, y: number = 0) {
        super('soil', 0xB58C00, size,x,y);
        this.sprite!.zIndex = -12

    }
}

export class Pasture extends Tile {
    constructor(size: number, x: number = 0, y: number = 0) {
        super('pasture', 0x24CA3D, size,x,y);
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

    getGridPosition(pos: Vector2D): Vector2D {
        return new Vector2D(
            Math.floor(pos.x / this.tileSize),
            Math.floor(pos.y / this.tileSize));
    }
    getTilePosition(pos: Vector2D): Vector2D {
        return new Vector2D(
            Math.floor(pos.x / this.tileSize)*this.tileSize,
            Math.floor(pos.y / this.tileSize)*this.tileSize);
    }
}