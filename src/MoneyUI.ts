import * as PIXI from 'pixi.js';

export class MoneyUI {
    container: PIXI.Container = new PIXI.Container();
    text: PIXI.Text;

    constructor() {
        this.text = new PIXI.Text({
            text: 'Dinero: $50',
            style: {
                fontSize: 20,
                fill: 0xFFD700,
                stroke: { width: 2, color: 0x000000 }
            }
        });
        this.text.x = 10;
        this.text.y = 10;
        this.container.addChild(this.text);
        
        this.container.zIndex = 100;
    }

    update(amount: number): void {
        this.text.text = `Dinero: $${amount}`;
    }
}