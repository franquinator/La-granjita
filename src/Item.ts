import * as PIXI from 'pixi.js';
import { Player } from './Player';

export abstract class Item {
    name: string;
    image: string;
    sprite: PIXI.Sprite | null = null;
    quantity: number = 1;
    maxStack: number = 99;
    price: number = 0;

    constructor(name: string, image: string, quantity: number = 1, maxStack: number = 99, price: number = 0) {
        this.name = name;
        this.image = image;
        this.quantity = quantity;
        this.maxStack = maxStack;
        this.price = price;
    }

    async createSprite(): Promise<PIXI.Sprite> {
        const texture = await PIXI.Assets.load(this.image);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(54 / 32);
        this.sprite.texture.source.scaleMode = 'nearest';
        return this.sprite;
    }

    use(count: number = 1): boolean {
        if (this.quantity >= count) {
            this.quantity -= count;
            return true;
        }
        return false;
    }

    add(count: number = 1): boolean {
        if (this.quantity + count <= this.maxStack) {
            this.quantity += count;
            return true;
        }
        return false;
    }

    abstract useFor(player: Player): void;
    abstract updateFor(player: Player): void;
}