import * as PIXI from 'pixi.js';
import {GameObject } from './GameObject.js';
import { game } from './Game.js';

export class Marco extends GameObject {
    size: number;
    initialized: boolean = false;

    constructor(size: number) {
        super();
        this.size = size;
    }

    init(): void {
        if (this.initialized) return;
        this.createSprite();
        this.render();
        this.initialized = true;
    }

    createSprite(): void {
        this.sprite = new PIXI.Graphics();
        
        this.sprite.rect(0, 0, this.size, this.size);
        this.sprite.stroke({ width: 2, color: 0xffffff});
        
        this.sprite.zIndex = 0;
    }

    render(): void {
        if (this.sprite) {
            game.addVisually(this.sprite);
        }
    }

    setVisibility(condition : boolean): void{
        this.sprite!.visible = condition;
    }

    setColor(color:number): void {
        this.sprite!.tint = color;
    }

    setPosition(x: number, y: number): void {
        if (this.sprite) {
            this.sprite.x = x;
            this.sprite.y = y;
        }
    }
}