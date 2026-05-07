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
    selector: PIXI.Graphics = new PIXI.Graphics();
    selectedSlot: number = -1;
    squareSize: number = 60;
    gap: number = 10;

    init(): void {
        const totalWidth = this.squareSize * 4 + this.gap * 3;
        const startX = (game.app!.screen.width - totalWidth) / 2;
        const startY = game.app!.screen.height - this.squareSize - 20;

        this.container.x = startX;
        this.container.y = startY;

        for (let i = 0; i < 4; i++) {
            const square = new PIXI.Graphics();
            square.rect(0, 0, this.squareSize, this.squareSize);
            square.fill({ color: 0x000000, alpha: 0.5 });
            square.x = i * (this.squareSize + this.gap);
            this.container.addChild(square);
            this.slots.push(square);
        }

        this.selector.rect(0, 0, this.squareSize, this.squareSize);
        this.selector.stroke({ width: 3, color: 0xffffff });
        this.selector.visible = false;
        this.container.addChild(this.selector);
    }

    marcarSlot(nroSlot: number): void {
        if (nroSlot < 0 || nroSlot >= this.slots.length) return;

        this.selectedSlot = nroSlot;
        this.selector.x = nroSlot * (this.squareSize + this.gap);
        this.selector.visible = true;
    }

    desmarcarSlot(): void {
        this.selectedSlot = -1;
        this.selector.visible = false;
    }
}

