import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { game } from './Game.js';
import { InventoryUI } from './InventoryUI.js';
import { MoneyUI } from './MoneyUI.js';

export class UI extends GameObject {
    uiContainer: PIXI.Container = new PIXI.Container();
    inventoryUI: InventoryUI = new InventoryUI();
    moneyUI: MoneyUI = new MoneyUI();

    async init(): Promise<void> {
        await this.createSprite();
        game.addVisually(this.uiContainer);
    }

    async createSprite(): Promise<void> {
        this.uiContainer.zIndex = 100;
        
        this.uiContainer.addChild(this.moneyUI.container);
        
        await this.inventoryUI.init();
        this.uiContainer.addChild(this.inventoryUI.container);
        
        (this as any).sprite = this.uiContainer;
    }
}