import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject.js';
import { Vector2D } from './types.js';
import { game } from './Game.js';


export interface PlayerOptions {
    width?: number;
    height?: number;
    color?: number;
    speed?: number;
}

export class Player extends GameObject {
    width: number;
    height: number;
    color: number;
    speed: number;
    direction: Vector2D = new Vector2D(0, 0);
    position: Vector2D = new Vector2D(0, 0);
    toolPosition: Vector2D = new Vector2D(0, 0);
    lastDirection: Vector2D = new Vector2D(0, 0);
    toolSprite: PIXI.Graphics | null = null;
    money: number = 0;
    private interact: () => void;

    constructor(options: PlayerOptions = {}) {
        super();
        this.width = options.width || 40;
        this.height = options.height || 40;
        this.color = options.color || 0xff6b6b;
        this.speed = options.speed || 300;

        this.position.x = 100;
        this.position.y = 100;

        this.zIndex = 10;

        this.money = 0;

        this.sprite = new PIXI.Graphics();
        this.sprite.zIndex = 1;
        this.sprite.rect(0, 0, this.width, this.height);
        this.sprite.fill(this.color);
        this.sprite.pivot.set(this.width / 2, this.width / 2);

        this.toolSprite = new PIXI.Graphics();
        this.toolSprite.zIndex = 2;
        this.toolSprite.rect(0, 0, 10, 10);
        this.toolSprite.fill(this.color);
        this.toolSprite.pivot.set(5, 5);

        this.interact = () => {
            const herramienta = game.ui.inventoryUI.getSelectedItem();
            if(herramienta){
                herramienta.useFor(this);
            }
        };

        this.updatePosition();


    }

    init(): void {
        game.addVisually(this.sprite);
        game.addToUpdate(this);

        game.app?.stage.addChild(this.toolSprite!);

        game.input.subscribe(this.interact, ['Space']);
        game.input.subscribe(() => game.ui.inventoryUI.selectSlot(12), ['Digit1']);
        game.input.subscribe(() => game.ui.inventoryUI.selectSlot(13), ['Digit2']);
        game.input.subscribe(() => game.ui.inventoryUI.selectSlot(14), ['Digit3']);
        game.input.subscribe(() => game.ui.inventoryUI.selectSlot(15), ['Digit4']);
    }

    update(delta: number): void {
        const moveSpeed = this.speed * delta;
        const input = game.input;
        if (!input) return;

        this.direction.x = 0;
        this.direction.y = 0;

        if (input.isAnyDown(['KeyW', 'ArrowUp'])) this.direction.y = -1;
        if (input.isAnyDown(['KeyS', 'ArrowDown'])) this.direction.y = 1;
        if (input.isAnyDown(['KeyA', 'ArrowLeft'])) this.direction.x = -1;
        if (input.isAnyDown(['KeyD', 'ArrowRight'])) this.direction.x = 1;

        this.direction = this.direction.normalize();

        this.position.x += this.direction.x * moveSpeed;
        this.position.y += this.direction.y * moveSpeed;

        if (this.direction.x !== 0 || this.direction.y !== 0) {
            this.lastDirection = this.direction.clone();
        }

        this.toolPosition = this.position.add(this.lastDirection.mult(30))

        this.toolSprite!.x = this.toolPosition.x;
        this.toolSprite!.y = this.toolPosition.y;

        this.toolPosition = game.terrain.getTilePosition(this.toolPosition)

        const herramienta = game.ui.inventoryUI.getSelectedItem();

        if(herramienta){
            herramienta.updateFor(this);
        } 
        else {
            game.marco.setVisibility(false);
        }
        
        this.updatePosition()
    }

    /*     interact(game: Game): void {
            const range = 60;
    
            for (const obj of game.updateGameObjects) {
                if (obj === this) continue;
                if (!obj.isInteractive) continue;
    
                const dx = Math.abs(this.sprite!.x - obj.x);
                const dy = Math.abs(this.sprite!.y - obj.y);
    
                if (dx < range && dy < range) {
                    if ('onInteract' in obj && typeof obj.onInteract === 'function') {
                        obj.onInteract(this, game);
                    }
                    return;
                }
            }
        } */

    addMoney(amount: number): void {
        this.money += amount;
        game.ui.moneyUI.update(this.money);
    }

    spendMoney(amount: number): boolean {
        if (this.money >= amount) {
            this.money -= amount;
            game.ui.moneyUI.update(this.money);
            return true;
        }
        return false;
    }
    updatePosition() {
        this.sprite!.x = this.position.x;
        this.sprite!.y = this.position.y;
    }

    constrain(screenWidth: number, screenHeight: number): void {
        if (!this.sprite) return;
        this.sprite.x = Math.min(Math.max(this.sprite.x, 0), screenWidth - this.width);
        this.sprite.y = Math.min(Math.max(this.sprite.y, 0), screenHeight - this.height);
    }

/*     private findInteractable(): any {
        const range = 60;
        for (const obj of game.updateGameObjects) {
            if (obj === this) continue;
            if (!obj.isInteractive) continue;
            const dx = Math.abs(this.position.x - obj.x);
            const dy = Math.abs(this.position.y - obj.y);
            if (dx < range && dy < range) {
                return obj;
            }
        }
        return null;
    } */

    get x(): number { return this.sprite?.x ?? 0; }
    get y(): number { return this.sprite?.y ?? 0; }
    get displayObject(): PIXI.Graphics | null { return this.sprite; }
}