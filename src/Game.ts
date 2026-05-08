import * as PIXI from 'pixi.js';
import { Input } from './Input.js';
import { Player } from './Player.js';
import { Marco } from './Marco.js';
import { GameObject } from './GameObject.js';
import { Terrain } from './Terrain.js';
import { UI } from './UI.js';

export class Game {
    app: PIXI.Application | null = null;
    input: Input = new Input();
    container: PIXI.Container | null = null;
    marco: Marco = new Marco(50);;
    terrain: Terrain = new Terrain(25, 12, 50);
    updateGameObjects: Set<GameObject> = new Set();
    money: number = 0;
    player: Player = new Player({ width: 40, height: 40, color: 0xff6b6b, speed: 300 });
    ui: UI = new UI();

    async init(): Promise<void> {
        this.app = new PIXI.Application();

        await this.app.init({
            resizeTo: window,
            backgroundColor: 0x228b22,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true
        });

        document.body.appendChild(this.app.canvas);
        this.app.stage.sortableChildren = true;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.marco.init();
        this.player.init();
        this.player.addMoney(50);
        this.terrain.init();
        this.ui.init();
        

        this.app.ticker.add((ticker) => {
            const delta = ticker.deltaTime / 60;
            this.update(delta);
        });
    }

    addToUpdate(obj: GameObject): void {
        this.updateGameObjects.add(obj);
    }

    removeFromUpdate(obj: GameObject): void {
        this.updateGameObjects.delete(obj);
    }

    addVisually(sprite: PIXI.Container | null): void {
        if(sprite == null){
            throw new Error('Sprite is null');
        }
        this.container?.addChild(sprite);
    }

    update(delta: number): void {
        this.updateGameObjects.forEach(gameObject => gameObject.update(delta, this));
    }

    getObjectAt(x: number, y: number, range: number = 50): GameObject | null {
        for (const obj of this.updateGameObjects) {
            if (obj === this.player) continue;
            const dx = Math.abs(x - obj.x);
            const dy = Math.abs(y - obj.y);
            if (dx < range && dy < range) return obj;
        }
        return null;
    }
}

export const game = new Game();