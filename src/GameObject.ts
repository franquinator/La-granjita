import * as PIXI from 'pixi.js';

export class GameObject {
    sprite: PIXI.Graphics | null = null;
    zIndex: number = 0;
    isInteractive: boolean = false;

    init(): void {}

    update(_delta: number, _game: Game): void {}

    get x(): number { return this.sprite?.x ?? 0; }
    get y(): number { return this.sprite?.y ?? 0; }
    get displayObject(): PIXI.Graphics | null { return this.sprite; }
}

export interface IGame {
    input: Input | null;
    addToUpdate(obj: GameObject): void;
    addVisually(sprite: PIXI.Container): void;
    player: Player | null;
    updateGameObjects: GameObject[];
}



import { Player } from './Player.js';
import { Input } from './Input.js';
import { Game } from './game.js';

