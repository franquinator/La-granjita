import { Item } from './Item.js';
import { Frutilla } from './Crops.js';
import { Sprite } from 'pixi.js';
import { loadCropTextures, getCropTexture } from './CropTextures.js';
import * as PIXI from 'pixi.js';
import { game } from './Game.js';

export type CropType = 'wheat' | 'corn' | 'tomato' | 'strawberry';

export const CROP_TYPES = {
    wheat: {
        name: 'Trigo',
        growTime: 10,
        sellPrice: 15,
        color: 0xf5deb3,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5],
        harvestYield: 1
    },
    corn: {
        name: 'Maíz',
        growTime: 15,
        sellPrice: 30,
        color: 0xffd700,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5],
        harvestYield: 1
    },
    tomato: {
        name: 'Tomate',
        growTime: 12,
        sellPrice: 25,
        color: 0xff6347,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 6,
        growFrames: [0, 1, 2, 3, 4, 5],
        harvestYield: 1
    },
    strawberry: {
        name: 'Frutilla',
        growTime: 1000,
        sellPrice: 20,
        color: 0xff69b4,
        spriteSheet: 'Spring Crops/Spring Crops.png',
        seedFrame: 0,
        growFrames: [1, 2, 3, 4, 5],
        harvestYield: 2
    }
};

export class Crop {
    type: CropType;
    data: typeof CROP_TYPES[CropType];
    timer: number = 0;
    isReady: boolean = false;
    sprite: Sprite;
    intervalId!: number;
    actualFrameIndex: number = 0;
    framesTotales!: number;

    constructor(type: CropType, container: PIXI.Container) {
        this.type = type;
        this.data = CROP_TYPES[type];
        this.sprite = new PIXI.Sprite(getCropTexture(this.actualFrameIndex));
        this.sprite.scale.set(40 / 16);
        this.sprite.x = 0;
        this.sprite.y = 0;
        this.sprite.texture.source.scaleMode = 'nearest';
        this.sprite.zIndex = 0;
        container.addChild(this.sprite);
        this.startUpdating();
    }
    private updatePlant(): void {
        this.dibujarFrameActual();
    }
    private startUpdating(): void {
        const interval = setInterval(() => {

            this.actualFrameIndex++;
            this.updatePlant();

            if (this.actualFrameIndex >= this.data.growFrames.length) {
                clearInterval(interval);
                this.isReady = true;
            }
        }, this.data.growTime);
    }

    dibujarFrameActual(): void {
        const texture = getCropTexture(this.data.growFrames[this.actualFrameIndex]);
        if (texture) {
            this.sprite.texture = texture;
        }
    }

    harvest(): void {
        this.destroyPlantSprite()
    }

    destroyPlantSprite(): void {
        if (this.sprite) {
            this.sprite.destroy();
        }
    }

    hasSprite(): boolean {
        return this.data.spriteSheet !== null;
    }

    getSpriteSheet(): string | null {
        return this.data.spriteSheet;
    }
}