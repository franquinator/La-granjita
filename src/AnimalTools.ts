import { game } from './Game';
import { Player } from './Player';
import { Item } from './Item';
import { Animal, AnimalType } from './Animal';

export class SpawnAnimales extends Item {
    private animalType: AnimalType = 'chicken';
    private static availableTypes: AnimalType[] = ['chicken', 'cow'];
    private currentTypeIndex: number = 0;

    constructor() {
        super("spawn_animales", "herramienta_semillas.png");
    }

    setAnimalType(type: AnimalType) {
        this.animalType = type;
    }

    cycleNextType() {
        this.currentTypeIndex = (this.currentTypeIndex + 1) % SpawnAnimales.availableTypes.length;
        this.animalType = SpawnAnimales.availableTypes[this.currentTypeIndex];
    }

    getCurrentType(): AnimalType {
        return this.animalType;
    }

    useFor(player: Player): void {
        const spawnX = player.position.x + player.lastDirection.x * 60;
        const spawnY = player.position.y + player.lastDirection.y * 60;
        const animal = new Animal(this.animalType, spawnX, spawnY);
        animal.init();
    }

    ejecutarComportamientoDelMarco(player: Player): void {
        game.marco.setColor(0x00ff00);
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
    }
}

export class Alimentar extends Item {
    constructor() {
        super("alimentar", "herramienta_semillas.png");
    }

    useFor(player: Player): void {
        const interactable = game.getObjectAt(player.toolPosition.x + 20, player.toolPosition.y + 20, 40);
        if (interactable instanceof Animal && !interactable.hasProduct) {
            interactable.feedTimer = 0;
        }
    }

    ejecutarComportamientoDelMarco(player: Player): void {
        const tilePos = player.toolPosition;
        const interactable = game.getObjectAt(tilePos.x + 20, tilePos.y + 20, 40);
        if (interactable instanceof Animal && !interactable.hasProduct) {
            game.marco.setColor(0x00ff00);
        } else {
            game.marco.setColor(0xff0000);
        }
        game.marco.setVisibility(true);
        game.marco.setPosition(tilePos.x, tilePos.y);
    }
}