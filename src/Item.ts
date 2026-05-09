import * as PIXI from 'pixi.js';
import { game } from './Game';
import { Player } from './Player';

export abstract class Item {
    name: string;
    image: string;
    sprite: PIXI.Sprite | null = null;

    constructor(name: string, image: string) {
        this.name = name;
        this.image = image;
    }

    async createSprite(): Promise<PIXI.Sprite> {
        const texture = await PIXI.Assets.load(this.image);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(54 / 32);
        this.sprite.texture.source.scaleMode = 'nearest';
        return this.sprite;
    }

    abstract useFor(player: Player): void;
    abstract updateFor(player: Player): void;
}