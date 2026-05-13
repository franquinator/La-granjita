import * as PIXI from 'pixi.js';
import { game } from './Game';
import { Player } from './Player';
import { Item } from './Item';
import { Soil } from './Terrain';
import { CropType } from './Crop';
import { loadCropTextures } from './CropTextures';
import { Vector2D } from './types';

function updateMarco(color: number, position: Vector2D): void {
    game.marco.setColor(color);
    game.marco.setVisibility(true);
    game.marco.setPosition(position.x, position.y);
}

export class Pala extends Item {
    constructor() {
        super("pala", "herramienta_pala.png");
    }

    useFor(player: Player) {
        const tileActual = game.terrain.getTileAtPosition(player.toolPosition);
        if (tileActual !instanceof Soil) {
            game.terrain.convertToSoil(player.toolPosition);
        }
    }

    updateFor(player: Player) {
        updateMarco(0xffff00, player.toolPosition);
    }
}

export class Regadera extends Item {
    azul: number = 0xffff00;
    constructor() {
        super("regadera", "herramienta_regadera.png");
    }

    useFor(player: Player) {
        const tileActual = game.terrain.getTileAtPosition(player.toolPosition);
        if (tileActual instanceof Soil && !tileActual.humedo) {
            tileActual.humedecer();
        }
    }

    updateFor(player: Player) {
        const tileActual = game.terrain.getTileAtPosition(player.toolPosition);
        const color = (tileActual instanceof Soil && !tileActual.humedo) ? 0x0000ff : 0xff0000;
        updateMarco(color, player.toolPosition);
    }
}

export class Semillas extends Item {
    private textureMap: Map<string, PIXI.Texture> | null = null;
    private cropType: CropType = 'strawberry';
    private texturesLoaded: boolean = false;

    private static availableTypes: CropType[] = ['wheat', 'corn', 'tomato', 'strawberry'];
    private currentTypeIndex: number = 3;

    setCropType(type: CropType) {
        this.cropType = type;
    }

    cycleNextType() {
        this.currentTypeIndex = (this.currentTypeIndex + 1) % Semillas.availableTypes.length;
        this.cropType = Semillas.availableTypes[this.currentTypeIndex];
    }

    getCurrentType(): CropType {
        return this.cropType;
    }

    constructor() {
        super("semillas", "herramienta_semillas.png");
    }

    private async ensureTextures(): Promise<void> {
        if (!this.texturesLoaded) {
            this.textureMap = await loadCropTextures();
            this.texturesLoaded = true;
        }
    }

    override async createSprite(): Promise<PIXI.Sprite> {
        await this.ensureTextures();
        if (this.textureMap) {
            const texture = this.textureMap.get('frame_6');
            if (texture) {
                this.sprite = new PIXI.Sprite(texture);
                this.sprite.scale.set(54 / 16);
                this.sprite.texture.source.scaleMode = 'nearest';
                return this.sprite;
            }
        }
        return super.createSprite();
    }

    useFor(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        if (tile instanceof Soil && tile.humedo && !tile.tienePlanta()) {
            tile.plantar(this.cropType);
            this.use(1);
        }
    }

    updateFor(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        const color = (tile instanceof Soil && tile.humedo && !tile.tienePlanta()) ? 0x00ff00 : 0xff0000;
        updateMarco(color, player.toolPosition);
    }
}

export class Cosecha extends Item {
    constructor() {
        super("cosecha", "herramienta_hoz.png");
    }

    useFor(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        if (tile instanceof Soil && tile.esPlantaLista()) {
            tile.harvest();
        }
    }

    updateFor(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        const color = (tile instanceof Soil && tile.esPlantaLista()) ? 0x00ff00 : 0xff0000;
        updateMarco(color, player.toolPosition);
    }
}