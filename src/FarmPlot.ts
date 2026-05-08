import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { Game } from './Game.js';
import { Crop, CropType } from './Crop.js';
import { Player } from './Player.js';

export const SEED_PRICES = {
    wheat: 5,
    corn: 10,
    tomato: 8
} as const;

export class FarmPlot extends GameObject {
    col: number;
    row: number;
    tileSize: number;
    crop: Crop | null = null;

    constructor(col: number, row: number, tileSize: number = 60) {
        super();
        this.col = col;
        this.row = row;
        this.tileSize = tileSize;
        this.crop = null;
        this.isInteractive = true;
        this.zIndex = 1;

        this.sprite = new PIXI.Graphics();
        this.drawPlot();
    }

    drawPlot(): void {
        if (!this.sprite) return;
        this.sprite.rect(0, 0, this.tileSize - 4, this.tileSize - 4);
        this.sprite.fill(0x8b4513);
        this.sprite.stroke({ width: 2, color: 0x5c4033 });
    }

    update(delta: number, _game: Game): void {
        if (this.crop) {
            this.crop.update(delta);
            this.drawCrop();
        }
    }

    drawCrop(): void {
        if (!this.sprite) return;

        this.sprite.clear();
        this.sprite.rect(0, 0, this.tileSize - 4, this.tileSize - 4);
        this.sprite.fill(0x8b4513);
        this.sprite.stroke({ width: 2, color: 0x5c4033 });

        if (!this.crop) return;

        if (this.crop.isReady) {
            this.sprite.rect(10, 10, this.tileSize - 24, this.tileSize - 24);
            this.sprite.fill(this.crop.data.color);
        } else {
            const progress = this.crop.getProgress();
            const size = (this.tileSize - 24) * progress;
            this.sprite.rect(
                (this.tileSize - 24 - size) / 2 + 12,
                (this.tileSize - 24 - size) / 2 + 12,
                size,
                size
            );
            this.sprite.fill(this.crop.data.color);
        }
    }

    onInteract(player: Player, _game: Game): void {
        if (!this.crop) {
            const seedTypes: CropType[] = ['wheat', 'corn', 'tomato'];
            const hasSeeds = seedTypes.some(seed => player.inventory?.hasItem(seed));

            if (hasSeeds && player.inventory) {
                const seeds = player.inventory.items.find(i => seedTypes.includes(i.id as CropType));
                if (seeds) {
                    player.inventory.removeItem(seeds.id, 1);
                    this.crop = new Crop(seeds.id as CropType);
                    this.drawCrop();
                }
            }
        } else if (this.crop.isReady) {
            const harvested = this.crop.harvest();
            if (harvested) {
                player.addMoney(harvested.value);
                this.crop = null;
                this.drawPlot();
            }
        }
    }

    get x(): number { return this.sprite?.x ?? 0; }
    get y(): number { return this.sprite?.y ?? 0; }
    get displayObject(): PIXI.Graphics | null { return this.sprite; }
}