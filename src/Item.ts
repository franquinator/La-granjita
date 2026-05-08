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
    abstract ejecutarComportamientoDelMarco(player: Player): void;

    ejecutarComportamientoDesde(player: Player) {
        this.ejecutarComportamientoDelMarco(player);

        if (game.input.isDown('Space')) {
            this.useFor(player);
            game.input!.keys['Space'] = false;
        }
    }
}