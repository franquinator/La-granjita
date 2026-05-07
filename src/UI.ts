import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { game } from './game.js';

export class UI extends GameObject {
    initialized: boolean = false;
    uiContainer: PIXI.Container = new PIXI.Container();
    toolbar: Toolbar = new Toolbar();

    init(): void {
        if (this.initialized) return;
        this.createSprite();
        this.render();
        this.initialized = true;
    }

    createSprite(): void {
        this.uiContainer.zIndex = 100;
        this.toolbar.init();
        this.uiContainer.addChild(this.toolbar.container);
        this.sprite = this.uiContainer as unknown as PIXI.Graphics;
    }

    render(): void {
        game.addVisually(this.uiContainer);
    }
}

class Toolbar {
    container: PIXI.Container = new PIXI.Container();
    slots: PIXI.Graphics[] = [];

    init(): void {
        const squareSize = 60;
        const gap = 10;
        const totalWidth = squareSize * 4 + gap * 3;
        const startX = (game.app!.screen.width - totalWidth) / 2;
        const startY = game.app!.screen.height - squareSize - 20;

        this.container.x = startX;
        this.container.y = startY;

        for (let i = 0; i < 4; i++) {
            const square = new PIXI.Graphics();
            square.rect(0, 0, squareSize, squareSize);
            square.fill({ color: 0x000000, alpha: 0.5 });
            square.x = i * (squareSize + gap);
            this.container.addChild(square);
            this.slots.push(square);
        }
    }
}

