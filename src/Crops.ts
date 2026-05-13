import * as PIXI from 'pixi.js';
import { Player } from './Player';
import { Item } from './Item';
import { loadCropTextures } from './CropTextures';

export class Frutilla extends Item {
    private static textureMap: Map<string, PIXI.Texture> | null = null;
    private static texturesLoaded: boolean = false;

    constructor(quantity: number = 1) {
        super("frutilla", "Spring Crops/Spring Crops.png", quantity, 99, 10);
    }

    private static async ensureTextures(): Promise<void> {
        if (!Frutilla.texturesLoaded) {
            Frutilla.textureMap = await loadCropTextures();
            Frutilla.texturesLoaded = true;
        }
    }

    override async createSprite(): Promise<PIXI.Sprite> {
        await Frutilla.ensureTextures();
        if (Frutilla.textureMap) {
            const texture = Frutilla.textureMap.get('frame_8');
            if (texture) {
                this.sprite = new PIXI.Sprite(texture);
                this.sprite.scale.set(54 / 16);
                this.sprite.texture.source.scaleMode = 'nearest';
                return this.sprite;
            }
        }
        return super.createSprite();
    }

    useFor(_player: Player): void {
    }

    updateFor(_player: Player): void {
    }
}