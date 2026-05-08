import * as PIXI from 'pixi.js';
import { game } from './Game';
import { Player } from './Player';
import { Item } from './Item';
import { Soil } from './Terrain';
import { CropType } from './Crop';

export class Pala extends Item {
    constructor() {
        super("pala", "herramienta_pala.png");
    }

    useFor(player: Player) {
        game.terrain.convertToSoil(player.toolPosition);
    }

    ejecutarComportamientoDelMarco(player: Player) {
        game.marco.setColor(0xffff00);
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
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

    ejecutarComportamientoDelMarco(player: Player) {
        const tileActual = game.terrain.getTileAtPosition(player.toolPosition);
        if (tileActual instanceof Soil && !tileActual.humedo) {
            game.marco.setColor(0x0000ff);
        }
        else {
            game.marco.setColor(0xff0000);
        }
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
    }
}

export class Semillas extends Item {
    private textureMap: Map<string, PIXI.Texture> | null = null;
    private cropType: CropType = 'strawberry';

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

    constructor(textureMap: Map<string, PIXI.Texture> | null = null) {
        super("semillas", "herramienta_semillas.png");
        this.textureMap = textureMap;
    }

    override async createSprite(): Promise<PIXI.Sprite> {
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
        }
    }

    ejecutarComportamientoDelMarco(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        if (tile instanceof Soil && tile.humedo && !tile.tienePlanta()) {
            game.marco.setColor(0x00ff00);
        } else {
            game.marco.setColor(0xff0000);
        }
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
    }
}

export class Cosecha extends Item {
    constructor() {
        super("cosecha", "herramienta_hoz.png");
    }

    useFor(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        if (tile instanceof Soil && tile.esPlantaLista()) {
            const harvested = tile.harvest();
            if (harvested) {
                player.addMoney(harvested.value);
            }
        }
    }

    ejecutarComportamientoDelMarco(player: Player): void {
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        if (tile instanceof Soil && tile.esPlantaLista()) {
            game.marco.setColor(0x00ff00);
        } else {
            game.marco.setColor(0xff0000);
        }
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
    }
}