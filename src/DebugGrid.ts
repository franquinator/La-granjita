import * as PIXI from 'pixi.js';
import { Grilla } from './Grilla.js';

export class DebugGrid {
    graphics: PIXI.Graphics;
    grilla: Grilla;
    visible: boolean = false;

    constructor(grilla: Grilla) {
        this.grilla = grilla;
        this.graphics = new PIXI.Graphics();
        this.graphics.zIndex = 999;
        this.graphics.visible = false;
    }

    toggle(): void {
        this.visible = !this.visible;
        this.graphics.visible = this.visible;
        if (this.visible) {
            this.draw();
        }
    }

    private draw(): void {
        const g = this.graphics;
        g.clear();
        g.setStrokeStyle({ width: 1, color: 0xffffff, alpha: 0.3 });
        
        const ancho = this.grilla.anchoCelda * this.grilla.celdasAncho;
        const alto = this.grilla.anchoCelda * this.grilla.celdasAlto;
        
        for (let x = 0; x <= this.grilla.celdasAncho; x++) {
            const px = x * this.grilla.anchoCelda;
            g.moveTo(px, 0);
            g.lineTo(px, alto);
        }
        for (let y = 0; y <= this.grilla.celdasAlto; y++) {
            const py = y * this.grilla.anchoCelda;
            g.moveTo(0, py);
            g.lineTo(ancho, py);
        }
        g.stroke();
    }
}