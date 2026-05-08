import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { game } from './Game.js';

export const ANIMAL_TYPES = {
    chicken: {
        name: 'Gallina',
        product: 'egg',
        productName: 'Huevo',
        feedTime: 5,
        productValue: 8,
        color: 0xffffff
    },
    cow: {
        name: 'Vaca',
        product: 'milk',
        productName: 'Leche',
        feedTime: 8,
        productValue: 20,
        color: 0x8b0000
    }
} as const;

export type AnimalType = keyof typeof ANIMAL_TYPES;

export interface AnimalData {
    name: string;
    product: string;
    productName: string;
    feedTime: number;
    productValue: number;
    color: number;
}

export class Animal extends GameObject {
    type: AnimalType;
    data: AnimalData;
    feedTimer: number = 0;
    hasProduct: boolean = false;

    constructor(type: AnimalType, x: number, y: number) {
        super();
        this.type = type;
        this.data = ANIMAL_TYPES[type] as AnimalData;
        this.feedTimer = 0;
        this.hasProduct = false;
        this.isInteractive = true;
        this.zIndex = 2;

        this.sprite = new PIXI.Graphics();
        this.sprite.x = x;
        this.sprite.y = y;
        this.drawAnimal();
    }

    drawAnimal(): void {
        if (!this.sprite) return;
        this.sprite.rect(0, 0, 40, 40);
        this.sprite.fill(this.data.color);
        this.sprite.stroke({ width: 2, color: 0x000000 });

        if (this.hasProduct) {
            this.sprite.circle(30, 10, 6);
            this.sprite.fill(0xffff00);
        }
    }

    init(): void {
        game.addToUpdate(this);
        game.addVisually(this.sprite);
    }

    update(delta: number, _game: Game): void {
        if (!this.hasProduct) {
            this.feedTimer += delta;
            if (this.feedTimer >= this.data.feedTime) {
                this.hasProduct = true;
                this.drawAnimal();
            }
        }
    }

    onInteract(player: Player, _game: Game): void {
        if (this.hasProduct) {
            player.addMoney(this.data.productValue);
            this.hasProduct = false;
            this.feedTimer = 0;
            this.drawAnimal();
        }
    }

    get x(): number { return this.sprite?.x ?? 0; }
    set x(val: number) { if (this.sprite) this.sprite.x = val; }
    get y(): number { return this.sprite?.y ?? 0; }
    set y(val: number) { if (this.sprite) this.sprite.y = val; }
    get displayObject(): PIXI.Graphics | null { return this.sprite; }
}

import { Player } from './Player.js';
import { Game } from './Game.js';
