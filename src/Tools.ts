import * as PIXI from 'pixi.js';
import { game } from './Game';
import { Player } from './Player';
import { Item } from './Item';
import { Soil } from './Terrain';
import { CropType } from './Crop';

let cropTexturesCache: Map<string, PIXI.Texture> | null = null;

export async function loadCropTextures(): Promise<Map<string, PIXI.Texture>> {
    if (cropTexturesCache) return cropTexturesCache;
    const textures = new Map<string, PIXI.Texture>();
    try {
        const sheet = await PIXI.Assets.load<PIXI.Texture>('Spring Crops/Spring Crops.png');
        for (let i = 0; i < 7; i++) {
            const frame = new PIXI.Rectangle(i * 16, 0, 16, 16);
            const texture = new PIXI.Texture({ source: sheet.source, frame });
            textures.set(`frame_${i}`, texture);
        }
        cropTexturesCache = textures;
    } catch (e) {
        console.error('Error loading crop textures:', e);
    }
    return textures;
}

export class Pala extends Item {
    constructor() {
        super("pala", "herramienta_pala.png");
    }

    useFor(player: Player) {
        game.terrain.convertToSoil(player.toolPosition);
    }

    updateFor(player: Player) {
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

    updateFor(player: Player) {
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
        if (!this.use(1)) return;
        const tile = game.terrain.getTileAtPosition(player.toolPosition);
        if (tile instanceof Soil && tile.humedo && !tile.tienePlanta()) {
            tile.plantar(this.cropType);
        }
    }

    updateFor(player: Player): void {
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

    updateFor(player: Player): void {
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