import { DroppedItem } from './DroppedItem.js';

export class Celda {
    entidades: Set<DroppedItem> = new Set();

    agregarEntidad(entidad: DroppedItem): void {
        this.entidades.add(entidad);
    }

    sacarEntidad(entidad: DroppedItem): void {
        this.entidades.delete(entidad);
    }

    obtenerEntidades(): DroppedItem[] {
        return Array.from(this.entidades);
    }
}

export class Grilla {
    celdas: Map<string, Celda> = new Map();
    anchoCelda: number = 0;
    celdasAncho: number = 0;
    celdasAlto: number = 0;

    init(ancho: number, alto: number, anchoCelda: number): void {
        this.anchoCelda = anchoCelda;
        this.celdasAncho = Math.ceil(ancho / anchoCelda);
        this.celdasAlto = Math.ceil(alto / anchoCelda);
        this.celdas.clear();
        this.initGrilla();
    }

    private initGrilla(): void {
        for (let x = 0; x < this.celdasAncho; x++) {
            for (let y = 0; y < this.celdasAlto; y++) {
                const hash = this.getHash(x, y);
                this.celdas.set(hash, new Celda());
            }
        }
    }

    private getHash(x: number, y: number): string {
        return `x_${x}_y_${y}`;
    }

    agregarEntidad(entidad: DroppedItem): void {
        const celda = this.getCeldaEnPos(entidad.x, entidad.y);
        celda.agregarEntidad(entidad);
    }

    actualizarEntidad(entidad: DroppedItem, oldX: number, oldY: number): void {
        const oldCelda = this.getCeldaEnPos(oldX, oldY);
        const newCelda = this.getCeldaEnPos(entidad.x, entidad.y);
        if (oldCelda !== newCelda) {
            oldCelda.sacarEntidad(entidad);
            newCelda.agregarEntidad(entidad);
        }
    }

    removerEntidad(entidad: DroppedItem): void {
        const celda = this.getCeldaEnPos(entidad.x, entidad.y);
        celda.sacarEntidad(entidad);
    }

    private getCeldaEnPos(x: number, y: number): Celda {
        const cx = Math.floor(x / this.anchoCelda);
        const cy = Math.floor(y / this.anchoCelda);
        const hash = this.getHash(cx, cy);
        const celda = this.celdas.get(hash);
        if (!celda) {
            const newCelda = new Celda();
            this.celdas.set(hash, newCelda);
            return newCelda;
        }
        return celda;
    }

    obtenerEntidadesCercanas(x: number, y: number, distancia: number): DroppedItem[] {
        const celdas = this.obtenerCeldasEnRango(x, y, distancia);
        const entidades: DroppedItem[] = [];
        for (const celda of celdas) {
            entidades.push(...celda.obtenerEntidades());
        }
        return entidades;
    }

    private obtenerCeldasEnRango(x: number, y: number, distancia: number): Celda[] {
        const celdas: Celda[] = [];
        const xMin = Math.max(0, Math.floor((x - distancia) / this.anchoCelda));
        const yMin = Math.max(0, Math.floor((y - distancia) / this.anchoCelda));
        const xMax = Math.min(this.celdasAncho, Math.ceil((x + distancia) / this.anchoCelda));
        const yMax = Math.min(this.celdasAlto, Math.ceil((y + distancia) / this.anchoCelda));

        for (let cx = xMin; cx < xMax; cx++) {
            for (let cy = yMin; cy < yMax; cy++) {
                const celda = this.celdas.get(this.getHash(cx, cy));
                if (celda) celdas.push(celda);
            }
        }
        return celdas;
    }
}