import { game } from './Game';
import { Player } from './Player';
import { Item } from './Item';

export class Pala extends Item {
    constructor() {
        super("pala","pala.png");
    }

    useFor(player: Player){
        game.terrain.convertToSoil(player.toolPosition)
    }

    ejecutarComportamientoDelMarco(player: Player){
        game.marco.setColor(0xffff00);
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
    }
}
export class Regadera extends Item {
    azul:number = 0xffff00;
    constructor() {
        super("regadera","regadera.png");
    }

    useFor(player: Player){
        game.terrain.convertToWetSoil(player.toolPosition)
    }

    ejecutarComportamientoDelMarco(player: Player){
        const tileActual = game.terrain.getTileAtPosition(player.toolPosition)
        if(tileActual && tileActual.type == 'soil'){
            game.marco.setColor(0x0000ff);
        }
        else{
            game.marco.setColor(0xff0000);
        }
        game.marco.setVisibility(true);
        game.marco.setPosition(player.toolPosition.x, player.toolPosition.y);
        
    }
}